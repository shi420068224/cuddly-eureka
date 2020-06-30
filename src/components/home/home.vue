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
          <el-submenu
            :index="''+item1.order"
            v-for="(item1, index) in menus"
            :key="index"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item
              :index="item2.path"
              v-for="(item2, index) in item1.children"
              :key="index"
            >
              <i class="el-icon-menu"></i>
              <span>{{ item2.authName }}</span>
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
  data() {
    return {
      menus: []
    };
  },
  beforeCreate() {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   this.$router.push({ name: "login" });
    // }
    // 判断 token 的导航守卫/路由守卫 在router.js 新增
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.menus = data;
        this.$message.info(msg);
      }
    },
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
