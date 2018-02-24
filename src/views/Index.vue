<template>
  <div id="index">
    <header-nav/>
    <transition name="slide-fade" mode="out-in">
      <router-view class="container"/>
    </transition>
    <footer-nav class="is-hidden-desktop"/>
  </div>
</template>

<script>
  import HeaderNav from '@/components/HeaderNav'
  import FooterNav from '@/components/FooterNav'

  export default {
    components: { HeaderNav, FooterNav }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #index {
    height: 100%;
    min-height: 100vh;
    padding-top: $header-nav-height;

    @media screen and (max-width: 768px) {
      padding-bottom: $footer-nav-height;

      > .container {
        height: 100%;
      }
    }
  }
</style>
