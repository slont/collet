<template>
  <div id="app" :class="{ 'is-active-modal': activeModal }">
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
      this.$store.commit('SET_MODAL_ACTIVE', false)
      this.$store.commit('SET_OG_TITLE', 'Cullet | 日常のメモをもっと楽しく')
      this.$store.commit('SET_OG_DESCRIPTION', '日常のメモを簡単に楽しく整理。テーマに合わせた文章や画像、SNS、ニュースなどをまとめてシェアできます。')
      this.$store.commit('SET_OG_IMAGE', 'https://www.cullet.me/static/img/cullet-logo_orange.png')
      this.$emit('updateHead')
    },
    head: {
      meta() {
        return [
          { property: 'og:title', content: this.$store.state.ogTitle },
          { property: 'og:description', content: this.$store.state.ogDescription },
          { property: 'og:url', content: `https://www.cullet.me${this.$route.fullPath}` },
          { property: 'og:image', content: this.$store.state.ogImage }
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
