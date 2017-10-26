import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'

Vue.use(Router)

// function requireAuth(to, from, next) {
//   if (!store.state.loggedIn) {
//     next({
//       path: '/login',
//       query: { redirect: to.fullPath }
//     })
//   } else {
//     next()
//   }
// }

export default new Router({
  routes: [
    {
      path: '/',
      component: Index
    }
  ]
})
