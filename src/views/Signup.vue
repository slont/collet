<template>
  <div id="signup">
    <div class="box">
      <template v-if="0 === pageIndex">
        <div class="title has-text-centered">{{ $t('title') }}</div>
        <div class="field-email field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">{{ $t('views.signup.email') }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input v-model="email" name="email" class="input" :class="{ 'is-danger': errors.has('email') }"
                       placeholder="slont.maytry@gmail.com" type="text" v-validate="'required|email'">
                <span class="icon is-small is-left"><i class="material-icons">email</i></span>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="field-password field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">{{ $t('views.signup.password') }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input v-model="password" name="password" class="input" :class="{ 'is-danger': errors.has('password') }"
                       placeholder="password" type="password" v-validate="'required|min:6'">
                <span class="icon is-small is-left"><i class="material-icons">vpn_key</i></span>
                <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
              </p>
            </div>
          </div>
        </div>

        <button @click="ok" class="button is-info" :class="{ 'is-loading': isLoading }">
          {{ $t('buttons.signup') }}
        </button>
        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      </template>

      <template v-else-if="1 === pageIndex">
        <div>確認メールを送信しました</div>
        <router-link to="/">トップページに戻る</router-link>
      </template>
    </div>
  </div>
</template>

<script>
  import AuthModel from '@/models/Auth'

  export default {
    data() {
      return {
        pageIndex: 0,
        locale: this.$store.state.locale,
        email: 'slont.maytry@gmail.com',
        password: 'password',
        isLoading: false,
        errorMessage: ''
      }
    },
    computed: {
      teamKey() {
        return this.$store.getters.teamKey
      }
    },
    methods: {
      ok() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          this.isLoading = true
          new AuthModel().signup({
            email: this.email,
            password: this.password
          }).then(() => {
            this.isLoading = false
            this.pageIndex = 1
          }).catch(err => {
            this.isLoading = false
            this.errorMessage = err.message
          })
        }).catch(() => {
          console.log('Correct them errors!')
        })
      },
      switchLocale() {
        this.$store.dispatch('setLocale', this.locale)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #signup {
    width: 100%;
    text-align: center;

    .box {
      width: 50%;
      min-width: 360px;
      margin: 3em auto;

      .label {
        min-width: 120px;
      }
      ul {
        margin-bottom: 1em;
      }
    }
  }
</style>
