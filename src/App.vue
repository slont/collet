<template>
  <div id="app">
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app',
    created() {
      this.$moment.locale(this.$store.state.locale)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #app {
    min-height: 100vh;
    width: 100%;
    top: 0;
    background-color: $bg-color;
  }
</style>
