<template>
  <el-card class="box-card">
    <!-- 封装的自定义 面包屑导航 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <el-row style="margin-top: 20px;">
      <el-col :span="6">
        <el-button type="primary" plain>添加角色</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleslist: []
    };
  },
  methods: {
    async getRoleList() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

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
    }
  },
  mounted() {
    this.getRoleList();
  }
};
</script>

<style></style>
