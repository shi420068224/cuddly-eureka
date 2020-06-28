// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import MyServerHttp from '@/plugins/http.js'
import moment from 'moment'

import MyBread from '@/components/cuscom/myBread'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import App from './App'
import router from './router'

// vue.配置.生产（上线） = 关闭
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(MyServerHttp)


// 全局过滤器 - 处理日期
Vue.filter('fmdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
Vue.component(MyBread.name, MyBread)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // render: (h) => h(App)
  components: {
    App
  },
  template: '<App/>'
})
