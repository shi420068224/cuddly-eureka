<template>
  <el-card class="box-card">
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <el-table
      :data="rightslist"
      border
      v-loading="loading"
      :height="mainHeight"
      style="width: 100%"
    >
      <el-table-column label="#" width="60" type="index"> </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="340"
      ></el-table-column>
      <el-table-column prop="path" label="路径" width="340"></el-table-column>
      <el-table-column label="层级" width="342">
        <template slot-scope="scope">
          <!-- scope.row.level  0 / 1 / 2 -->
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      mainHeight: "-1",
      type: "list",
      rightslist: [],
      loading: true
    };
  },
  created() {
    const bodyHeight = document.body.clientHeight;
    console.log(bodyHeight);
    this.mainHeight = bodyHeight - 60 - 80 - 36;
  },
  methods: {
    async getRightsList() {
      const res = await this.$http.get(`rights/${this.type}`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.rightslist = data;
        this.loading = false;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  },
  mounted() {
    this.getRightsList();
  }
};
</script>

<style>
.el-table {
  margin-top: 20px;
}
</style>
