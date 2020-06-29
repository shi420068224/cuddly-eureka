<template>
  <el-card class="box-card">
    <!-- 封装的自定义 面包屑导航 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <el-row style="margin-top: 20px;">
      <el-col :span="6">
        <el-button type="primary" plain>添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="roleslist" style="width: 100%">
      <el-table-column width="60" type="expand">
        <!-- 展开的字表 -->
        <template slot-scope="scope">
          <!-- scope.row.children -->
          <el-row
            v-for="(itme1, i) in scope.row.children"
            :key="i"
            class="itemRow"
          >
            <el-col :span="4">
              <el-tag closable @close="deleRight(scope.row, itme1.id)">{{
                itme1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(itme2, i) in itme1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    @close="deleRight(scope.row, itme2.id)"
                    >{{ itme2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="(itme3, i) in itme2.children"
                    :key="i"
                    type="info"
                    closable
                    @close="deleRight(scope.row, itme3.id)"
                    >{{ itme3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限的提示 -->
          <el-alert
            v-if="scope.row.children.length === 0"
            title="未分配权限"
            type="warning"
            :closable="false"
          ></el-alert>
        </template>
        <!-- 展开的字表 END-->
      </el-table-column>

      <el-table-column
        prop="roleName"
        label="角色名称"
        width="340"
      ></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="460">
      </el-table-column>
      <el-table-column prop="id" label="操作" width="200">
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
            @click="showSetRightDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <!-- 添加用户 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形结构 -->
      <!--
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
       -->
      <el-tree
        ref="tree"
        :data="rightslist"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleslist: [],
      rightslist: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      arrcheck: [],
      dialogFormVisibleRight: false,
      currRoleId: -1
    };
  },
  methods: {
    async getRoleList() {
      const res = await this.$http.get(`roles`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        console.log(data);
        this.roleslist = data;
        this.$message.info(msg);
      }
    },

    // 取消权限
    async deleRight(role, rightId) {
      // roleId: 当前角色ID
      // rightId: 要删除的权限ID
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      console.log(res);
      // 删除成功 返回了 200 和 该角色的剩余权限

      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // this.getRoleList() -> 更新整个视图 -> 没必要
        role.children = data;
        this.$message.warning(msg);
      }
    },
    // 分配权限
    async showSetRightDia(role) {
      this.currRoleId = role.id;
      const res = await this.$http.get(`rights/tree`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.rightslist = data;
        this.dialogFormVisibleRight = true;
      }
      // 获取当前角色roled的权限ID, 树形结构展开显示已选权限
      console.log(role);
      let arrtemp2 = [];
      role.children.forEach(item1 => {
        // arrtemp2.push(item1.id)
        item1.children.forEach(item2 => {
          // arrtemp2.push(item2.id)
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          });
        });
      });
      this.arrcheck = arrtemp2;
    },
    // 角色授权
    async setRoleRight() {
      // roles/:roleId/rights
      // :roleId -> 当前需要授权/修改 的角色ID
      // rids -> 树形结构中，所有全选和半选的lable对应的ID ->arr []

      // 获取全选的id数组arr1 -> getCheckedKeys()
      // 获取半选的id数组arr2 -> getHalfCheckedKeys()
      // rids = arr1 + arr2
      // ES6 展开运算符 ...数组/对象
      // 1.给要操作的dom元素设置ref属性   input ref="txt"
      // 2.this.$refs.ref属性值.js方法   this.$refs.txt.foucs()

      let arr1 = this.$refs.tree.getCheckedKeys();
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      let arr = [...arr1, ...arr2];
      console.log(arr.join(","));
      const res = await this.$http.post(`roles/${(this.currRoleId)}/rights`, {
        rids: arr.join(",")
      });
      console.log(res);
      // 更新视图
      this.getRoleList();
      // 关闭对话框
      this.dialogFormVisibleRight = false;

    }
  },
  mounted() {
    this.getRoleList();
  }
};
</script>

<style>
.el-tag {
  margin: 3px 6px;
}
</style>
