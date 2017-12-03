import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Signup from '@/views/Signup.vue'
import Signin from '@/views/Signin.vue'
import Confirm from '@/views/Confirm.vue'
import TopIndex from '@/views/top/Index'
import TopTop from '@/views/top/Top'
import UserpageIndex from '@/views/userpage/Index'
import UserpageTheme from '@/views/userpage/Theme'
import UserpageItem from '@/views/userpage/Item'
import SettingsIndex from '@/views/settings/Index'
import SettingsProfile from '@/views/settings/Profile'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signup',
      component: Signup
    }, {
      path: '/signin',
      component: Signin
    }, {
      path: '/confirm',
      component: Confirm
    },
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
          path: 'settings',
          component: SettingsIndex,
          children: [
            {
              path: 'profile',
              component: SettingsProfile
            }
          ]
        }, {
          path: ':userName',
          component: UserpageIndex
        }, {
          path: ':userName/:themeId',
          component: UserpageTheme
        }, {
          path: ':userName/:themeId/:itemId',
          component: UserpageItem
        }
      ]
    }
  ]
})
