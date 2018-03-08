<template>
  <div id="top-index">
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
      background-color: white;
      margin-bottom: 0;

      > ul {
        max-width: $width;
        margin-left: auto;
        margin-right: auto;
        border-bottom-color: transparent;

        li {
          a {
            border-bottom-width: 0;
          }
          &.router-link-exact-active {
            a {
              border-bottom-width: 3px;
            }
          }
        }
      }
    }
  }
</style>
