import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { LOCALES } from '@/constant'
import { SET_USER, SET_LOCALE } from './mutation-types'

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
    }
  },
  mutations: {
    [SET_LOCALE](state, locale) {
      state.locale = locale
    },
    [SET_USER](state, user) {
      state.user = user
    }
  },
  plugins: [createPersistedState()]
})
