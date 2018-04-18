import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Signup from '@/views/Signup'
import Signin from '@/views/Signin'
import Confirm from '@/views/Confirm'
import CreateItem from '@/views/CreateItem'
import EditItem from '@/views/EditItem'
import TopIndex from '@/views/top/Index'
import TopTop from '@/views/top/Top'
import TagIndex from '@/views/tag/Index'
import SearchIndex from '@/views/search/Index'
import UserpageIndex from '@/views/userpage/Index'
import UserpageItem from '@/views/userpage/Item'
import UserpageTheme from '@/views/userpage/Theme'
import SettingsIndex from '@/views/settings/Index'
import SettingsProfile from '@/views/settings/Profile'
import SettingsPassword from '@/views/settings/Password'

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
            }, {
              path: 'password',
              component: SettingsPassword
            }
          ]
        }, {
          path: 'tag',
          component: TagIndex
        }, {
          path: 's',
          component: SearchIndex
        }, {
          path: 's/:type',
          component: SearchIndex
        }, {
          path: 'u/:userId/themes',
          component: UserpageIndex
        }, {
          path: 'u/:userId/favorites',
          component: UserpageIndex
        }, {
          path: 'u/:userId/:themeId/:itemId',
          component: UserpageItem
        }, {
          path: 'u/:userId/:themeId',
          component: UserpageTheme
        }, {
          path: 'u/:userId',
          component: UserpageIndex
        },
        // モバイル向け
        {
          path: 'm/createItem/:themeId',
          component: CreateItem
        },
        {
          path: 'm/editItem/:themeId/:itemId',
          component: EditItem
        }
      ]
    }
  ]
})
