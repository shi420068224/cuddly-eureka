import Vue from 'vue'
import Router from 'vue-router'

import {
  Message
} from 'element-ui';

// import Login from '../components/login/login'
// @ -> src/
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/users/users'
import Right from '@/components/rights/right'
import Roles from '@/components/rights/roles'
import Goods from '@/components/goods/goodslist'
import GoodsAdd from '@/components/goods/goodsadd'
import CateParams from '@/components/goods/cateparams'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/rights',
          name: 'rights',
          component: Right
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goodsadd',
          name: 'goodsadd',
          component: GoodsAdd
        },
        {
          path: '/params',
          name: 'params',
          component: CateParams
        }
      ]
    }
  ]
})

// 导航守卫/路由守卫

// 处理：统一判断是否存在token
/*
router.beforeEach((to,from,next)=>{

})

参数：
  to    返回一个对象，去向 / 要去路由标识的配置信息
  from  返回一个对象，来自 / 当前路由标识的配置信息
  next  返回一个函数方法，next() / 继续执行
*/

router.beforeEach((to, from, next) => {
  // 如果，去向 /login 页面，直接继续执行，不做任何处理
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    // 如果，没有token，去向 /login 页
    // 提示请先登录
    if (!token) {
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return
    }
    // 如果，存在token，继续执行即可
    next()
  }
})

// this.$message.warning()，this指的是Vue实例
// 在当前router.js配置文件中不存在Vue实例，根据ElementUI中，Message 消息提示
// 可单独引用 Message 消息方法，import { Message } from 'element-ui';
// 再调用，Message.warning()

export default router
