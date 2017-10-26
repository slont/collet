<template>
  <div id="top">
    <transition name="slide-fade" mode="out-in">
      <hello></hello>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Hello from '@/components/Hello'

  export default {
    components: { Hello }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #index {
    height: 100%;
    width: 100%;
  }
</style>
