<template>
  <div id="search-index" @scroll="infiniteScroll">
    <header class="search-header header-shadow">
      <div class="tabs">
        <ul>
          <router-link :to="{path: `/s/themes`, query: $route.query}" class="cullet-tab" tag="li">
            <a class="has-text-centered">
              <span class="label-name">みんなの<br/>テーマ</span><br/>
            </a>
          </router-link>
          <router-link :to="{path: `/s/items`, query: $route.query}" class="cullet-tab" tag="li">
            <a class="has-text-centered">
              <span class="label-name">みんなの<br/>カレット</span><br/>
            </a>
          </router-link>
          <router-link :to="{path: `/s/myItems`, query: $route.query}" class="cullet-tab" tag="li" v-if="loggedIn">
            <a class="has-text-centered">
              <span class="label-name">My<br/>カレット</span><br/>
            </a>
          </router-link>
          <router-link :to="{path: `/s/myThemes`, query: $route.query}" class="cullet-tab" tag="li" v-if="loggedIn">
            <a class="has-text-centered">
              <span class="label-name">My<br/>テーマ</span><br/>
            </a>
          </router-link>
          <router-link :to="{path: `/s/users`, query: $route.query}" class="favorite-tab" tag="li">
            <a class="has-text-centered">
              <span class="label-name">ユーザー</span>
            </a>
          </router-link>
        </ul>
      </div>
    </header>

    <transition name="slide-fade" mode="out-in">
      <themes v-if="'themes' === activeType" ref="themes"/>
      <items v-if="'items' === activeType" ref="items"/>
      <my-themes v-else-if="'myThemes' === activeType" ref="myThemes"/>
    </transition>
  </div>
</template>

<script>
  import Themes from './Themes'
  import Items from './Items'
  import MyThemes from './MyThemes'

  export default {
    components: {Themes, Items, MyThemes},
    computed: {
      activeType: ({$route}) => $route.params.type
    },
    methods: {
      infiniteScroll($e) {
        if (this.$el.scrollHeight <= $e.target.scrollTop + $e.target.offsetHeight) {
          this.$refs[this.activeType].fetch()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #search-index {
    $header-height: 44px;
    padding-top: $header-height;
    height: 100%;
    overflow-y: scroll;

    .search-header {
      position: fixed;
      top: $header-nav-height;
      right: 0;
      left: 0;
      height: $header-height;
      background-color: white;
      z-index: 19;

      .tabs {
        > ul {
          max-width: $width;
          margin-left: auto;
          margin-right: auto;
          border-bottom-color: transparent;

          li {
            &:not(.router-link-active) a {
              border: none;
            }
            a {
              font-size: $size-7;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
