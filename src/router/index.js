import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Signup from '@/pages/Signup'
import Signin from '@/pages/Signin'
import Auth from '@/pages/Auth'
import Confirm from '@/pages/Confirm'
import TempItem from '@/pages/TempItem'
import EditTempItem from '@/pages/EditTempItem'
import CreateItem from '@/pages/CreateItem'
import EditItem from '@/pages/EditItem'
import TermsOfService from '@/pages/TermsOfService'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TopIndex from '@/pages/top/Index'
import SearchIndex from '@/pages/search/Index'
import UserpageIndex from '@/pages/u/Index'
import UserpageItem from '@/pages/u/Item'
import UserpageTheme from '@/pages/u/Theme'
import SettingsIndex from '@/pages/settings/Index'
import SettingsProfile from '@/pages/settings/Profile'
import SettingsPassword from '@/pages/settings/Password'

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
      path: '/auth',
      component: Auth
    }, {
      path: '/confirm',
      component: Confirm
    }, {
      path: '/terms-of-service',
      component: TermsOfService
    }, {
      path: '/privacy-policy',
      component: PrivacyPolicy
    }, {
      path: '/',
      component: Index,
      children: [
        {
          path: '',
          component: TopIndex
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
          path: 's/:type',
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
        }, {
          path: 'tempItem',
          component: TempItem
        }, {
          path: 'm/editTempItem',
          component: EditTempItem
        }, {
          path: 'm/editItem/:themeId/:itemId',
          component: EditItem
        }
      ]
    }
  ]
})
