<template>
  <div id="signup" class="flexbox">
      <div class="box">
        <router-link to="/" tag="div" class="title has-text-centered">
          <img class="cullet-logo" src="/static/img/cullet-logo_orange.png" alt="Cullet">
        </router-link>

        <transition name="slide-fade" mode="out-in">
          <div key="0" v-if="0 === pageIndex">
            <div class="field-email field">
              <label class="label">{{ $t('views.signup.email') }}</label>
              <p class="control is-expanded has-icons-left">
                <input v-model="email" name="email" class="input" :class="{ 'is-danger': errors.has('email') }"
                       placeholder="some@sample.com" type="text" v-validate="'required|email'">
                <span class="icon is-small is-left"><i class="material-icons">email</i></span>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
              </p>
            </div>

            <div class="field has-text-centered">
              <guard-button :click="confirmEmail" class="is-info fullwidth" :class="{ 'is-loading': isLoading }"
                            :disabled="!email || errors.has('email')">
                確認メールを送信
              </guard-button>
            </div>
            <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>

            <div class="field has-text-centered">
              <router-link :to="{path: '/signin', replace: true}" class="label">
                ログインはこちらから
              </router-link>
            </div>

            <div class="field is-size-8">
              <a href="/terms-of-service" target="_blank">利用規約</a>、<a href="/privacy-policy" target="_blank">プライバシーポリシー</a>に同意して利用してください
            </div>
          </div><!-- page0 -->

          <div key="1" v-else-if="1 === pageIndex">
            <h4 class="title is-5">{{ $t('views.signup.inputPinCode') }}</h4>
            <div class="field is-horizontal">
              <input v-model="pinCode1" class="input" type="number" ref="pinCode1"
                     maxlength="1" min="0" max="9" @input="onInput($event, 1)" @focus="$event.target.select()"/>
              <input v-model="pinCode2" class="input" type="number" ref="pinCode2"
                     maxlength="1" min="0" max="9" @input="onInput($event, 2)" @focus="$event.target.select()"/>
              <input v-model="pinCode3" class="input" type="number" ref="pinCode3"
                     maxlength="1" min="0" max="9" @input="onInput($event, 3)" @focus="$event.target.select()"/>
              <input v-model="pinCode4" class="input" type="number" ref="pinCode4"
                     maxlength="1" min="0" max="9" @input="onInput($event, 4)" @focus="$event.target.select()"/>
              <input v-model="pinCode5" class="input" type="number" ref="pinCode5"
                     maxlength="1" min="0" max="9" @input="onInput($event, 5)" @focus="$event.target.select()"/>
              <input v-model="pinCode6" class="input" type="number" ref="pinCode6"
                     maxlength="1" min="0" max="9" @input="onInput($event, 6)" @focus="$event.target.select()"/>
            </div>
            <button class="button is-info is-fullwidth is-medium" :class="{ 'is-loading': isLoading }"
                    :disabled="pinCode.length !== 6" @click="confirmCode">
              <span>確認</span>
            </button>
            <span class="help is-danger" v-if="errorMessage">{{ errorMessage }}</span>
          </div><!-- page1 -->

          <div key="2" v-else-if="2 === pageIndex">
            <div class="field-id field">
              <label class="label">{{ $t('views.signup.userId') }}</label>
              <p class="control is-expanded has-icons-left">
                <input v-model="id" name="userId" class="input" :class="{ 'is-danger': errors.has('userId') }"
                       placeholder="user-id" type="text" v-validate="'max:32|regex:^([a-zA-Z0-9_-]+)$'">
                <span class="icon is-left">@</span>
                <span v-show="errors.has('userId')" class="help is-danger">{{ errors.first('userId') }}</span>
              </p>
            </div>

            <div class="field-password field">
              <label class="label">{{ $t('views.signup.password') }}</label>
              <p class="control is-expanded has-icons-left">
                <input v-model="password" name="password" class="input" :class="{ 'is-danger': errors.has('password') }"
                       placeholder="password" type="password" v-validate="'required|min:6'">
                <span class="icon is-left"><i class="material-icons">vpn_key</i></span>
                <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
              </p>
            </div>

            <div class="field has-text-centered">
              <guard-button :click="signup" class="is-info fullwidth" :class="{ 'is-loading': isLoading }">
                {{ $t('buttons.signup') }}
              </guard-button>
            </div>
            <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>

            <div class="field has-text-centered">
              <router-link to="/signin" class="label">
                ログインはこちらから
              </router-link>
            </div>
          </div><!-- page2 -->
        </transition>
      </div>
  </div>
</template>

<script>
  import AuthModel from '@/models/Auth'
  import ThemeModel from '@/models/Theme'

  export default {
    data() {
      return {
        pageIndex: 0,
        locale: this.$store.state.locale,
        email: '',
        id: '',
        password: '',
        pinCode1: '',
        pinCode2: '',
        pinCode3: '',
        pinCode4: '',
        pinCode5: '',
        pinCode6: '',
        isLoading: false,
        errorMessage: ''
      }
    },
    computed: {
      teamKey() {
        return this.$store.getters.teamKey
      },
      pinCode() {
        return this.pinCode1 + this.pinCode2 + this.pinCode3 + this.pinCode4 + this.pinCode5 + this.pinCode6
      }
    },
    methods: {
      async confirmEmail() {
        if (!await this.$validator.validateAll()) return

        this.isLoading = true
        new AuthModel().confirmEmail({
          email: this.email
        }).then(() => {
          this.isLoading = false
          this.pageIndex++
        }).catch(err => {
          this.isLoading = false
          this.errorMessage = err.message
          throw new Error(err)
        })
      },
      confirmCode() {
        this.errorMessage = ''

        if (6 !== this.pinCode.length || this.isLoading) {
          return
        }
        this.isLoading = true

        new AuthModel().confirmCode({
          email: this.email,
          pinCode: this.pinCode
        }).then(res => {
          this.isLoading = false
          this.pageIndex++
        }).catch(() => {
          this.isLoading = false
          this.errorMessage = this.$t('views.signup.invalidCode')
        })
      },
      async signup() {
        if (!await this.$validator.validateAll()) return

        this.isLoading = true
        new AuthModel().signup({
          id: this.id,
          email: this.email,
          pinCode: this.pinCode,
          password: this.password
        }).then(res => {
          this.$store.dispatch('signin', res.data)
          this.isLoading = false

          new ThemeModel().create({
            title: this.$t('models.theme.defaultTitle'),
            description: '',
            image: '',
            tags: [],
            createdUser: this.$store.state.user,
            private: 2
          }).catch(err => {
            this.errorMessage = err
          })
          this.$router.push('/')
        }).catch(err => {
          this.isLoading = false
          this.errorMessage = err.message
          throw new Error(err)
        })
      },
      switchLocale() {
        this.$store.dispatch('setLocale', this.locale)
      },
      onInput(e, index) {
        if (/^\d{2,}$/.test(e.target.value)) {
          this.pinCode1 = e.target.value.substr(0, 1)
          this.pinCode2 = e.target.value.substr(1, 1)
          this.pinCode3 = e.target.value.substr(2, 1)
          this.pinCode4 = e.target.value.substr(3, 1)
          this.pinCode5 = e.target.value.substr(4, 1)
          this.pinCode6 = e.target.value.substr(5, 1)
        } else if (e.target.value && 6 > index) {
          this.$refs['pinCode' + (index + 1)].focus()
        }
        if (6 === this.pinCode.length) {
          this.confirmCode()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #signup {
    width: 100%;

    .box {
      width: 360px;
      margin: 120px auto 0;

      .title {
        .cullet-logo {
          height: 64px;
        }
      }
      .label {
        min-width: 120px;
      }
      ul {
        margin-bottom: 1em;
      }
      > * {
        margin-right: .25rem;
      }
      .button,
      .input {
        font-size: 1rem;
        font-weight: bold;
      }
      .input[type="number"] {
        font-size: 3rem;
        height: 1.75em;
        text-align: center;
        font-weight: bold;
        padding: .25rem;
        -moz-appearance: textfield;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        &:not(:last-child) {
          margin-right: .25rem;
        }
      }
    }
  }
</style>
