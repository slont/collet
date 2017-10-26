<template>
  <div id="top">
    <hello></hello>
  </div>
</template>

<script>
  import Hello from '@/components/Hello'

  export default {
    components: { Hello }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #top {
    width: 70%;
    height: 100%;
    min-width: 600px;
    margin: 0 auto;
    padding: 1rem 0;
  }
</style>
