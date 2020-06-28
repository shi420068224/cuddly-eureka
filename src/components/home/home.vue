<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2"
          ><div class="grid-content bg-purple">
            <img src="../../assets/logo.png" alt="无法显示图片" /></div
        ></el-col>
        <el-col :span="20"><h3>电商系统</h3></el-col>
        <el-col :span="2"
          ><div class="grid-content bg-purple">
            <a href="#" @click.prevent="handleSignout()">退出</a>
          </div></el-col
        >
      </el-row>
    </el-header>
    <el-container style="height:calc(100% - 60px);">
      <el-aside width="200px">
        <!-- 侧边栏 -->
        <el-menu
          :unique-opened="true"
          :router="true"
          background-color="#304156"
          text-color="#FFF"
        >
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-location"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-location"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //  获取tokan
  // if token 有 -> 继续渲染组件
  // token 没有 -> 登录

  beforeCreate() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push({ name: "login" });
    }
  },
  methods: {
    handleSignout() {
      // 1.清除token
      // 2.提示
      // 3.来到login组件
      localStorage.clear();
      this.$message.success("退出成功");
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style>
.el-container {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-header img {
  width: 40px;
  float: left;
  margin: 10px;
}

.el-header h3 {
  line-height: 60px;
}

.el-header a {
  text-decoration: none;
}

.el-aside {
  background-color: rgb(48, 65, 86);
  color: rgb(64, 158, 255);
  text-align: left;
  line-height: 200px;
  /* height: calc(100% - 60px); */
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* height: calc(100% - 60px); */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
