<template>
  <el-card class="box-card">
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <el-table :data="rightslist" border v-loading="loading" height="445" style="width: 100%">
      <el-table-column label="#" width="60" type="index"> </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="340"
      ></el-table-column>
      <el-table-column prop="path" label="路径" width="340"></el-table-column>
      <el-table-column label="层级" width="342">
        <template slot-scope="scope">
          {{ scope.row.level | levelStr }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      type: "list",
      rightslist: [],
      loading: true
    };
  },
  methods: {
    async getRightsList() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(`rights/${this.type}`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.rightslist = data;
        this.loading = false
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  },
  mounted() {
    this.getRightsList();
  },
  filters: {
    levelStr(v) {
      return Number.parseInt(v) + 1 + "级";
    }
  }
};
</script>

<style>
.el-table {
  margin-top: 20px;
}
</style>
