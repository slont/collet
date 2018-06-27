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
    },
    head: {
      meta() {
        return [
          { name: 'description', content: this.$store.state.description },
          { property: 'og:title', content: this.$store.state.title },
          { property: 'og:description', content: this.$store.state.description },
          { property: 'og:type', content: 'website' },
          { property: 'og:site_name', content: 'Cullet' },
          { property: 'og:url', content: 'https://www.cullet.me/' },
          { property: 'og:image', content: 'https://www.cullet.me/static/img/cullet-logo_orange.png' },
          { name: 'twitter:card', content: 'summary' }
        ]
      }
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
