<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      :label-position="labelPosition"
      label-width="80px"
      :model="formdata"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click.prevent="handleLogin()"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    //登录请求

    async handleLogin() {
      // 希望 让异步操作的代码，看起来像同步代码
      // ES7 新特性 -> async + await
      // 1、 找到异步操作有结果的代码， 在当前代码前加 await,同时接受异步操作的结果
      // 2、  找到距离异步操作有结果的代码最近的方法，前面加 async

      const res = await this.$http.post("login", this.formdata);
      const {
        data,
        meta: { msg, status }
      } = res.data;

      if (status === 200) {
        this.$message.success(msg);
        this.$router.push({ name: "home" });
      } else {
        this.$message.error(msg);
      }

      /*
      this.$http
        .post("login", this.formdata)
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data;

          if (status === 200) {
            this.$message.success(msg);
            this.$router.push({name: 'home'})
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
      */
    }
  }
};
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  /* 弹性盒子布局 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
