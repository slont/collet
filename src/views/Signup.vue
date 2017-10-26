<template>
  <div id="signup">
    <div class="box">
      <div class="title has-text-centered">{{ $t('views.login.title') }}</div>
      <div class="subtitle has-text-centered">{{ teamKey }}.reword.com</div>
      <p v-if="$route.query.redirect">
        {{ $t('views.login.redirectMessage') }}
      </p>
      <form @submit.prevent="login">
        <div class="field-email field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">{{ $t('views.login.email') }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input v-model="email" name="email" class="input" :class="{ 'is-danger': errors.has('email') }"
                       placeholder="test@syncthought.com" type="text" v-validate="'required|email'">
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

        <button type="submit" class="button is-info" :class="{ 'is-loading': isLoading }">
          {{ $t('buttons.signIn') }}
        </button>
        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
        <router-link to="/">{{ $t('views.login.passwordReset') }}</router-link>
      </form>
    </div>
    <div class="field">
      <p class="control select">
        <select v-model="locale" @change="switchLocale">
          <option value="ja">{{ $t('locales.ja') }}</option>
          <option value="en">{{ $t('locales.en') }}</option>
        </select>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        locale: this.$store.state.locale,
        email: 'test@syncthought.com',
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
      login() {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.isLoading = true
            this.$store.dispatch('signup', {
              email: this.email,
              passwd: this.password
            }).then(() => {
              this.isLoading = false
              this.$router.push(this.$route.query.redirect || '/')
            }).catch(err => {
              this.errorMessage = err.message
              this.isLoading = false
            })
          }
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
      width: 60%;
      margin: 3em auto;

      ul {
        margin-bottom: 1em;
      }
    }
  }
</style>
