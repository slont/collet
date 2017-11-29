<template>
  <div id="top-index">
    <div class="tabs">
      <ul>
        <router-link to="/" tag="li"><a>TOP</a></router-link>
        <router-link to="/recommend" tag="li"><a>おすすめ</a></router-link>
      </ul>
    </div>
    <transition name="slide-fade" mode="out-in" class="content">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  const DEFAULT_TAB = 'top'

  export default {
    data() {
      return {
        activeTab: DEFAULT_TAB
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #top-index {
    .tabs {
      .router-link-exact-active {
        @extend .is-active;
      }
    }
  }
</style>
