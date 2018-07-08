<template>
  <div id="index">
    <header-nav/>
    <transition name="slide-fade" mode="out-in">
      <router-view class="container"/>
    </transition>
    <footer-nav class="is-hidden-tablet"/>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
  import HeaderNav from '@/components/HeaderNav'
  import FooterNav from '@/components/FooterNav'

  export default {
    components: { HeaderNav, FooterNav },
    computed: {
      user: ({$store}) => $store.state.user
    },
    created() {
      if (this.user.id && !this.$store.state.theme.id) {
        new UserModel().findThemes(this.user.id, {p: 1, s: 1, q: ''}).then(res => {
          if (res.data.length) {
            this.$store.dispatch('setTheme', res.data[0])
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #index {
    position: relative;
    height: 100vh;
    padding-top: $header-nav-height;

    @media screen and (max-width: 768px) {
      padding-bottom: $footer-nav-height;
    }
  }
</style>
