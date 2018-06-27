// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './styles/global.scss'
import loadImage from 'blueimp-load-image'
import dataURLtoBlob from 'blueimp-canvas-to-blob'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Vuex from 'vuex'
import VueHead from 'vue-head'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import VueMoment from 'vue-moment'
import VueAutosize from 'vue-autosize'
import SocialSharing from 'vue-social-sharing'
import Element from 'element-ui'
import messages from './locales'
import validateConfig from '../config/validate'
import VueCarousel from 'vue-carousel'
import GuardButton from './components/GuardButton'
import UserImage from './components/UserImage'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueHead, {
  separator: ' | '
})
Vue.use(VueI18n)

Vue.use(VeeValidate, Object.assign({}, validateConfig, {
  locale: store.state.locale
}))
Vue.use(VueAutosize)
Vue.use(VueMoment)
const i18n = new VueI18n({
  locale: store.state.locale,
  messages
})
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(SocialSharing)

Vue.filter('truncate', (text, stop) => text.slice(0, stop) + (stop < text.length ? '...' : ''))

let isLoadedInstgrm = false
// Custom Plugin
Vue.use({
  install: (Vue, options) => {
    Vue.mixin({
      computed: {
        loggedIn() {
          return this.$store.state.loggedIn
        },
        windowWidth() {
          return window.innerWidth
        },
        isMobile() {
          return 768 >= this.windowWidth
        }
      },
      async mounted() {
        if (!isLoadedInstgrm) {
          const s = document.createElement('script')
          s.setAttribute('src', 'https://www.instagram.com/embed.js')
          document.body.appendChild(s)
          await new Promise(resolve => {
            s.onload = () => resolve(window.twttr)
            isLoadedInstgrm = true
          })
        }
      },
      methods: {
        fromNow(datetime, format = 'YYYY/MM/DD HH:mm') {
          const dt = this.$moment(datetime)
          if (3 >= this.$moment().diff(dt, 'days')) {
            return dt.fromNow()
          } else {
            return dt.format(format)
          }
        },
        dataURLtoBlob: dataURLtoBlob,
        createDataUrl(e, callback) {
          const MAX_WIDTH = 1080
          const MAX_SIZE = 60000
          const files = e.target.files || e.dataTransfer.files
          if (!files.length) return

          const file = files[0]
          loadImage.parseMetaData(file, data => {
            const options = {
              orientation: null,
              canvas: true
            }
            if (data.exif) {
              options.orientation = data.exif.get('Orientation')
            }
            loadImage(file, canvas => {
              let dataUrl = ''
              if (MAX_WIDTH < canvas.width) {
                const scaleRatio = canvas.height / canvas.width
                const oc = document.createElement('canvas')
                const octx = oc.getContext('2d')
                oc.width = MAX_WIDTH
                oc.height = MAX_WIDTH * scaleRatio
                octx.drawImage(canvas, 0, 0, oc.width, oc.height)
                const sizeRatio = Math.min(0.9, MAX_SIZE / (file.size * ((MAX_WIDTH / canvas.width) ** 2)) + 0.2)
                dataUrl = oc.toDataURL(file.type, sizeRatio)
              } else {
                const sizeRatio = Math.min(0.92, MAX_SIZE / file.size + 0.2)
                dataUrl = canvas.toDataURL(file.type, sizeRatio)
              }

              callback(dataUrl, file.name)
            }, options)
          })
        },
        reloadInstgrm() {
          if (window.instgrm) {
            window.instgrm.Embeds.process()
          }
        }
      }
    })
  }
})

Vue.use(VueCarousel)
Vue.component(GuardButton.name, GuardButton)
Vue.component(UserImage.name, UserImage)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  i18n
})
