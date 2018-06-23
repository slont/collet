<template>
  <div id="auth">
    <div>ログイン処理をしています...</div>
    <div class="control is-loading is-size-1"></div>
  </div>
</template>

<script>
  import AuthModel from '@/models/Auth'

  export default {
    async created() {
      await new AuthModel().callback(this.$route.query)
    },
    async mounted() {
      setTimeout(async _ => {
        if (!this.loggedIn) {
          const res = await new AuthModel().signinTwitter()
          if (res.data.user && 'TwitterClient' === this.$route.query.client_name) {
            this.$store.dispatch('signinTwitter', res.data)
          }
        }
        this.$router.push('/')
      }, 1000)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #auth {
    padding: 3rem;
    text-align: center;

    .is-loading {
      width: 60%;
    }
  }
</style>
