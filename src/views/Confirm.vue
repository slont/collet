<template>
  <div id="confirm">
    <div class="box">
      <div class="title has-text-centered">{{ $t('title') }}</div>
      <div class="subtitle has-text-centered">{{ $t('views.confirm.pleaseInputYourName') }}</div>

      <div class="field-name field">
        <input v-model="name" name="name" class="input" :class="{ 'is-danger': errors.has('name') }"
               type="text" v-validate="'required'">
        <div v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</div>
      </div>

      <div>
        <guard-button :click="ok" class="button is-info" :class="{ 'is-loading': isLoading }">
          {{ $t('buttons.signin') }}
        </guard-button>
      </div>
      <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: '',
        isLoading: false,
        errorMessage: ''
      }
    },
    computed: {
      userId() {
        return this.$route.query.id
      }
    },
    methods: {
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.isLoading = true
          await this.$store.dispatch('confirm', {
            id: this.userId,
            name: this.name
          }).catch(err => {
            this.errorMessage = err.message
            this.isLoading = false
          })

          this.isLoading = false
          this.$router.push(this.$route.query.redirect || '/')
        }).catch(() => {
          console.log('Correct them errors!')
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #confirm {
    width: 100%;
    text-align: center;

    .box {
      width: 360px;
      margin: 3em auto;

      ul {
        margin-bottom: 1em;
      }
    }
  }
</style>
