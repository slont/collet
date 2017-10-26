// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import VueMoment from 'vue-moment'
import messages from './locales'
import moment from 'moment'
import 'moment/min/locales.min'
import validateConfig from '../config/validate'

moment.locale(store.state.locale)
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VeeValidate, validateConfig)
Vue.use(VueMoment, { moment })
const i18n = new VueI18n({
  locale: store.state.locale,
  messages
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
