// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import VueMoment from 'vue-moment'
import VueAutosize from 'vue-autosize'
import Element from 'element-ui'
import messages from './locales'
import moment from 'moment'
import 'moment/min/locales.min'
import validateConfig from '../config/validate'
import GuardButton from './components/GuardButton'

moment.locale(store.state.locale)
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VeeValidate, validateConfig)
Vue.use(VueAutosize)
Vue.use(VueMoment, { moment })
const i18n = new VueI18n({
  locale: store.state.locale,
  messages
})
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.filter('truncate', (text, stop) => text.slice(0, stop) + (stop < text.length ? '...' : ''))

// Custom Plugin
Vue.use({
  install: (Vue, options) => {
    Vue.mixin({
      components: {GuardButton}
    })
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  i18n
})
