<template>
  <div id="app">
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" rel="stylesheet/scss">
  #app {
    min-height: 100vh;
    background-color: $bg-color;
  }
</style>
