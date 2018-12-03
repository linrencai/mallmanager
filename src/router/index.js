import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Roles from '@/components/rights/roles.vue'
import Goodslist from '@/components/goods/goodslist.vue'
import Goodsadd from '@/components/goods/goodsadd.vue'
import Cateparams from '@/components/goods/cateparams.vue'
import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: [{
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },
      {
        name: 'right',
        path: '/rights',
        component: Right
      },
      {
        name: 'roles',
        path: '/roles',
        component: Roles
      },
      {
        name: 'goods',
        path: '/goods',
        component: Goodslist
      },
      {
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      },
      {
        name: 'params',
        path: '/params',
        component: Cateparams
      }
      ]
    }
  ]
})


// 路由导航/守卫

router.beforeEach((to, from, next) => {
  // 排除登录页
  if (to.path === '/login') {
    next()//执行渲染页面
  } else {
    // 如果要去的不是登录页面
    const token = localStorage.getItem('token')

    if (!token) {
      // 没有token值就跳转会登陆页面
          // 提示请先登录
      Message.warning('请先登录！')
      router.push({
          name:'login'
      })
      return
    }
    // 如果有token，直接渲染页面
    next()
  }
})


export default router