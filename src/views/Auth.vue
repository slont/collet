<template>
  <div id="auth">
  </div>
</template>

<script>
  import AuthModel from '@/models/Auth'

  export default {
    async created() {
      await new AuthModel().callback(this.$route.query).then(async res => {
        return new AuthModel().signinTwitter()
      }).then(res => {
        this.$store.dispatch('signinTwitter', res.data)
        this.$router.push('/')
      })
    },
    mounted() {
      if (this.$route.query.client_name) {
        this.$router.push('/')
      }
    },
    updated() {
      if (this.$route.query.client_name) {
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #auth {
  }
</style>
