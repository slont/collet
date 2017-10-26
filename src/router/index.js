import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Index from '@/views/Index'
import Signup from '@/views/Signup.vue'
import Signin from '@/views/Signin.vue'
import Top from '@/views/top/Index'

Vue.use(Router)

function requireAuth(to, from, next) {
  if (!store.state.loggedIn) {
    next({
      path: '/signin',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '',
          component: Top
        }
      ],
      beforeEnter: requireAuth
    }, {
      path: '/signup',
      component: Signup
    }, {
      path: '/signin',
      component: Signin
    }
  ]
})
