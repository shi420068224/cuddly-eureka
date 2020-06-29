<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="loadUserList()"
        >
          <el-button
            @click="searchUser()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="info" plain @click="showAddUserDia()">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="userlist" style="width: 100%">
      <el-table-column label="#" width="60" type="index"> </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="140"
      ></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <!-- <el-table-column prop="create_time" label="创建时间" width="200"></el-table-column> -->
      <el-table-column label="创建时间" width="200">
        <!--
          若该单元格内显示的内容不是字符串，
          需要给被显示的内容外层包裹一个template标签

          template内部要使用数据，设置slot-scope属性
          该属性的值是要用数据create_time的数据源 ->userlist

          slot-scope的值userlist其实就是el-table绑定的数据userlist
          userlist.row -> 数组中的每个对象
         -->
        <template slot-scope="scope">{{
          scope.row.create_time | fmdate
        }}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserMgState(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetUserRoleDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页
      前提:该接口支持分页,url参数中有pagenum/pagesize/...
    -->
    <!--
      @size-change    每页显示条数变化时触发
      @current-change 当前页变化时触发
      current-page    设置当前第几页
      page-sizes      每页多少条数据数组
      page-size       设置显示多少条
      total           数据总数
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input
            v-model="form.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog title="角色分配" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{ currUsername }}
        </el-form-item>

        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currRoleId" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="setUserRoles()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      userlist: [],
      // 分页相关数据
      total: -1,
      pagenum: 1,
      pagesize: 2,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      // 添加用户表单数据
      /*
        username	用户名称	不能为空
        password	用户密码	不能为空
        email	邮箱	可以为空
        mobile	手机号	可以为空
      */
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // currUserId = -1
      // 分配角色
      roles: [],
      currRoleId: -1,
      currUsername: "",
      currUserId: -1
    };
  },
  created() {
    this.getUesrList();
  },
  methods: {
    async getUesrList() {
      // query    查询条件
      // pagenum  当前页码
      // pagesize 每页显示条数

      // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      //const AUTH_TOKEN = localStorage.getItem("token");
      //this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // token 在 axios 配置文件中设置拦截器统一处理

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      const {
        data: { users, total },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.userlist = users;
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 分页相关方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getUesrList();
      // this.pagenum = 1
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUesrList();
    },
    // 搜索事件
    searchUser() {
      this.getUesrList();
    },
    // 清空搜索框事件
    loadUserList() {
      this.getUesrList();
    },

    // 添加用户
    //显示
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;
    },
    // 发送请求
    async addUser() {
      const res = await this.$http.post(`users`, this.form);
      console.log(res);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 201) {
        // 1.提示成功
        // 2.关闭对话框
        // 3.更新视图
        // 4.清空文本框
        this.dialogFormVisibleAdd = false;
        this.getUesrList();
        for (const key in this.form) {
          if (this.form.hasOwnProperty(key)) {
            this.form[key] = "";
          }
        }
      }
      this.$messgae.warning(msg);
    },
    // 删除用户
    showDeleUserMsgBox(userId) {
      this.$confirm("删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`);
        console.log(res);
        const {
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.pagenum = 1;
          this.$message.success(msg);
          this.getUesrList();
        }
      });
    },
    // 编辑用户对话框
    // 显示
    showEditUserDia(user) {
      // 获取用户数据
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    async editUser(userId) {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      console.log(res);

      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.pagenum = 1;
        this.$message.success(msg);
        this.getUesrList();
        for (const key in this.form) {
          if (this.form.hasOwnProperty(key)) {
            this.form[key] = "";
          }
        }
      }
    },
    // 修改状态
    async changeUserMgState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    // 分配角色
    async showSetUserRoleDia(user) {
      this.currUsername = user.username;
      this.currUserId = user.id;
      const resRoles = await this.$http.get(`roles`);
      this.roles = resRoles.data.data;
      // 获取用户角色ID -> rid
      const res = await this.$http.get(`users/${user.id}`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      this.currRoleId = data.rid;
      this.dialogFormVisibleRole = true;
    },
    // 添加角色 提交
    async setUserRoles() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });

      const {
        data,
        meta: { msg, status }
      } = res.data;

      if(status === 200){
        this.$message.success(msg)
        this.getUesrList()
        this.dialogFormVisibleRole = false;
      }

    }
  }
};
</script>

<style>
.searchRow {
  margin-top: 20px;
}
.inputSearch {
  width: 300px;
}
</style>
