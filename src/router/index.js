import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Signup from '@/views/Signup.vue'
import Signin from '@/views/Signin.vue'
import Confirm from '@/views/Confirm.vue'
import TopIndex from '@/views/top/Index'
import TopTop from '@/views/top/Top'
import MypageIndex from '@/views/mypage/Index'
import MypageItems from '@/views/mypage/Items'
import MypageElements from '@/views/mypage/Elements'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '',
          component: TopIndex,
          children: [
            {
              path: '',
              component: TopTop
            }
          ]
        }, {
          path: 'mypage',
          component: MypageIndex
        }, {
          path: 'mypage/:themeId',
          component: MypageItems
        }, {
          path: 'mypage/:themeId/:itemId',
          component: MypageElements
        }
      ]
    }, {
      path: '/signup',
      component: Signup
    }, {
      path: '/signin',
      component: Signin
    }, {
      path: '/confirm',
      component: Confirm
    }
  ]
})
