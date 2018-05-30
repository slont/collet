<template>
  <div id="signin">
    <div class="box">
      <div class="title has-text-centered">
        <img class="cullet-logo" src="/static/img/cullet-logo_orange.png" alt="Colette">
      </div>

      <div class="field">
        <guard-button :click="signinTwitter" class="is-info fullwidth" :class="{ 'is-loading': isLoadingTwitter }">
          <span class="icon"><i class="fab fa-twitter fa-fw"></i></span>
          <span>Twitterアカウントでログイン</span>
        </guard-button>
      </div>

      <template v-if="isVisibleForm">
        <div class="field-email field">
          <label class="label">{{ $t('views.signin.email') }}</label>
          <p class="control is-expanded has-icons-left">
            <input v-model="email" name="email" class="input" :class="{ 'is-danger': errors.has('email') }"
                   placeholder="some@sample.com" type="text" v-validate="'required|email'">
            <span class="icon is-left"><i class="material-icons">email</i></span>
            <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
          </p>
        </div>

        <div class="field-password field">
          <label class="label">{{ $t('views.signin.password') }}</label>
          <p class="control is-expanded has-icons-left">
            <input v-model="password" name="password" class="input" :class="{ 'is-danger': errors.has('password') }"
                   placeholder="password" type="password" v-validate="'required|min:6'">
            <span class="icon is-left"><i class="material-icons">vpn_key</i></span>
            <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
          </p>
        </div>
      </template>

      <div class="field">
        <a @click="isVisibleForm = true" class="button fullwidth" v-if="!isVisibleForm">
          <span class="icon"><i class="far fa-envelope fa-fw"></i></span>
          <span>メールアドレスでログイン</span>
        </a>
        <guard-button :click="ok" class="is-primary is-size-5 fullwidth" :class="{ 'is-loading': isLoading }" v-else>
          <span>{{ $t('buttons.signin') }}</span>
        </guard-button>
      </div>

      <!--<div class="has-text-centered">-->
        <!--<a @click="ok" class="button is-info">-->
          <!--Twitterでログイン-->
        <!--</a>-->
      <!--</div>-->

      <!--<div class="has-text-centered">-->
        <!--<a @click="ok" class="button is-info">-->
          <!--Facebookでログイン-->
        <!--</a>-->
      <!--</div>-->

      <div class="has-text-centered">
        <div>または</div>
        <router-link to="/signup" class="is-small">
          メールアドレスで新規登録
        </router-link>
      </div>

      <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      <!--<router-link to="/">{{ $t('views.signin.passwordReset') }}</router-link>-->
    </div>
    <!--<div class="field">-->
      <!--<p class="control select">-->
        <!--<select v-model="locale" @change="switchLocale">-->
          <!--<option value="ja">{{ $t('locales.ja') }}</option>-->
          <!--<option value="en">{{ $t('locales.en') }}</option>-->
        <!--</select>-->
      <!--</p>-->
    <!--</div>-->
  </div>
</template>

<script>
  import AuthModel from '@/models/Auth'

  export default {
    data() {
      return {
        locale: this.$store.state.locale,
        email: this.$store.state.loginInfo.email || '',
        password: this.$store.state.loginInfo.password || '',
        checkedSaveLoginInfo: !!this.$store.state.loginInfo.email,
        isLoading: false,
        isLoadingTwitter: false,
        isVisibleForm: false,
        errorMessage: ''
      }
    },
    computed: {
      teamKey() {
        return this.$store.getters.teamKey
      }
    },
    methods: {
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.isLoading = true
          const loginInfo = {
            email: this.email,
            password: this.password
          }
          await this.$store.dispatch('signin', loginInfo).catch(err => {
            this.errorMessage = err.message
            this.isLoading = false
            throw new Error(err)
          })
          if (this.checkedSaveLoginInfo) {
            this.$store.dispatch('setLoginInfo', loginInfo)
          } else {
            this.$store.dispatch('setLoginInfo', {})
          }

          this.isLoading = false
          this.$router.push(this.$route.query.redirect || '/')
        }).catch(() => {
          console.log('Correct them errors!')
        })
      },
      async signinTwitter() {
        if (this.isLoadingTwitter) return

        this.isLoadingTwitter = true
        await new AuthModel().signinTwitter({}).then(res => {
          this.$store.dispatch('signinTwitter', res.data)
          this.$router.push('/')
        })
        this.isLoadingTwitter = false
      },
      logout() {
        new AuthModel().logout({}).then(res => {
          console.log(res)
        })
      },
      switchLocale() {
        this.$store.dispatch('setLocale', this.locale)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #signin {
    width: 100%;

    .title {
      .cullet-logo {
        height: 64px;
      }
    }
    .box {
      max-width: 400px;
      margin: 3em auto;

      ul {
        margin-bottom: 1em;
      }
    }
  }
</style>
