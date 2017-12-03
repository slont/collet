<template>
  <div id="top-index">
    <div class="tabs header-shadow">
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
      background-color: white;

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
            @extend .is-active;

            a {
              border-bottom-width: 2px;
            }
          }
        }
      }
    }
  }
</style>
