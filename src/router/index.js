import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login/login'
// @ -> src/
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/users/users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'users',
          name: 'users',
          component: Users
        }
      ]
    }
  ]
})
