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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="#" width="60" type="index"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="140"> </el-table-column>
      <el-table-column prop="address" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="address" label="电话" width="200">
      </el-table-column>
      <el-table-column prop="address" label="创建时间" width="200">
      </el-table-column>
      <el-table-column prop="address" label="用户状态" width="100">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="180">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        }
      ]
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

      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        console.log(res);
        this.$message.success(msg)
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
