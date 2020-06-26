<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="info" plain>添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="userlist" style="width: 100%">
      <el-table-column label="#" width="60" type="index"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="140">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="200">
      </el-table-column>
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
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="180">
        <template slot-scope="">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
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
      pagesize: 2
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
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

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
