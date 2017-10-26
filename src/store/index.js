import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import AuthModel from '@/models/Auth'
import { LOCALES } from '@/constant'
import { SET_USER, SET_LOCALE, SET_LOGGED_IN } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: LOCALES.JA,
    user: {},
    team: {},
    teams: []
  },
  getters: {},
  actions: {
    setLocale({ commit }, locale) {
      commit(SET_LOCALE, locale)
    },
    setUser({commit}, user) {
      commit(SET_USER, user)
    },
    login({ commit }, login) {
      const authModel = new AuthModel()
      return authModel.login(login).then(res => {
        localStorage.accessToken = res.data.accessToken
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
    logout({ commit }) {
      const authModel = new AuthModel()
      return authModel.logout().then(() => {
        delete localStorage.accessToken
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
    }
  },
  plugins: [createPersistedState()]
})
