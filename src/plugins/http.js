// 插件模块

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install =  (Vue) => {

  // 设置基础URL
  axios.defaults.baseURL= 'http://localhost:8888/api/private/v1/'

  // 在请求发起之前，设置头部(拦截器)
  axios.interceptors.request.use(function (config) {
    console.log('拦截器被触发');
    if(config.url!=='login'){
      const AUTH_TOKEN = localStorage.getItem("token");
      config.headers.Authorization = AUTH_TOKEN;
    }
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
