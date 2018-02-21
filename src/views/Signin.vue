<template>
  <div id="signin">
    <div class="box">
      <div class="title has-text-centered">{{ $t('title') }}</div>
      <p v-if="$route.query.redirect">
        {{ $t('views.signin.redirectMessage') }}
      </p>
      <div class="field-email field">
        <label class="label">{{ $t('views.signin.email') }}</label>
        <p class="control is-expanded has-icons-left">
          <input v-model="email" name="email" class="input" :class="{ 'is-danger': errors.has('email') }"
                 placeholder="slont.maytry@gmail.com" type="text" v-validate="'required|email'">
          <span class="icon is-small is-left"><i class="material-icons">email</i></span>
          <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
        </p>
      </div>

      <div class="field-password field">
        <label class="label">{{ $t('views.signin.password') }}</label>
        <p class="control is-expanded has-icons-left">
          <input v-model="password" name="password" class="input" :class="{ 'is-danger': errors.has('password') }"
                 placeholder="password" type="password" v-validate="'required|min:6'">
          <span class="icon is-small is-left"><i class="material-icons">vpn_key</i></span>
          <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
        </p>
      </div>

      <div class="has-text-centered">
        <a @click="ok" class="button is-info" :class="{ 'is-loading': isLoading }">
          {{ $t('buttons.signin') }}
        </a>
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
  export default {
    data() {
      return {
        locale: this.$store.state.locale,
        email: '',
        password: '',
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
          this.$store.dispatch('signin', {
            email: this.email,
            password: this.password
          }).then(() => {
            this.isLoading = false
            this.$router.push(this.$route.query.redirect || '/')
          }).catch(err => {
            this.errorMessage = err.message
            this.isLoading = false
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
  #signin {
    width: 100%;

    .title {
      text-align: center;
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
