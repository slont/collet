<template>
  <div id="index">
    <header-nav></header-nav>
    <transition name="slide-fade" mode="out-in">
      <router-view class="container"></router-view>
    </transition>
  </div>
</template>

<script>
  import HeaderNav from '@/components/HeaderNav'

  export default {
    components: { HeaderNav }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #index {
    height: 100%;
  }
</style>
