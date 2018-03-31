import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import AuthModel from '@/models/Auth'
import { LOCALES } from '@/constant'
import { SET_USER, SET_LOCALE, SET_LOGGED_IN, SET_LOGIN_INFO, SET_HEADER_ACTIVE, SET_FOOTER_ACTIVE } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: LOCALES.JA,
    user: {},
    loggedIn: false,
    loginInfo: {},
    activeHeader: true,
    activeFooter: true
  },
  getters: {},
  actions: {
    setLocale({ commit }, locale) {
      commit(SET_LOCALE, locale)
    },
    setUser({commit}, user) {
      commit(SET_USER, user)
    },
    setLoggedIn({commit}, loggedIn) {
      commit(SET_LOGGED_IN, loggedIn)
    },
    setLoginInfo({commit}, loginInfo) {
      commit(SET_LOGIN_INFO, loginInfo)
    },
    signin({ commit }, params) {
      const authModel = new AuthModel()
      return authModel.signin(params).then(res => {
        localStorage.authToken = res.data.authToken
        commit(SET_LOGGED_IN, true)
        commit(SET_USER, res.data.user)
        authModel.onChange(true)
        return Promise.resolve(res)
      }).catch(err => {
        if (err) {
          console.log(err)
        }
        authModel.onChange(false)
        return Promise.reject(err)
      })
    },
    confirm({ commit }, params) {
      const authModel = new AuthModel()
      return authModel.confirm(params).then(res => {
        localStorage.authToken = res.data.authToken
        commit(SET_LOGGED_IN, true)
        commit(SET_USER, res.data.user)
        authModel.onChange(true)
        return Promise.resolve(res)
      }).catch(err => {
        if (err) {
          console.log(err)
        }
        authModel.onChange(false)
        return Promise.reject(err)
      })
    },
    signout({ commit }) {
      const authModel = new AuthModel()
      return authModel.signout().then(() => {
        delete localStorage.authToken
        commit(SET_LOGGED_IN, false)
        commit(SET_USER, {})
        authModel.onChange(false)
        return Promise.resolve()
      }).catch(err => {
        if (err) {
          console.log(err)
        }
        return Promise.reject(err)
      })
    },
    setActiveHeader({ commit }, active) {
      commit(SET_HEADER_ACTIVE, active)
    },
    setActiveFooter({ commit }, active) {
      commit(SET_FOOTER_ACTIVE, active)
    }
  },
  mutations: {
    [SET_LOCALE](state, locale) {
      state.locale = locale
    },
    [SET_USER](state, user) {
      state.user = user
    },
    [SET_LOGGED_IN](state, loggedIn) {
      state.loggedIn = loggedIn
    },
    [SET_LOGIN_INFO](state, loginInfo) {
      state.loginInfo = loginInfo
    },
    [SET_HEADER_ACTIVE](state, active) {
      state.activeHeader = active
    },
    [SET_FOOTER_ACTIVE](state, active) {
      state.activeFooter = active
    }
  },
  plugins: [createPersistedState()]
})
