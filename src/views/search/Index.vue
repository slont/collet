<template>
  <div id="search-index">
    <div class="tabs">
      <ul>
        <router-link :to="`/s`" class="cullet-tab" tag="li" exact>
          <a class="has-text-centered">
            <span class="label-name">Myカレット</span><br/>
          </a>
        </router-link>
        <router-link :to="`/s/items`" class="theme-tab" tag="li" exact>
          <a class="has-text-centered">
            <span class="label-name">みんなの投稿</span><br/>
          </a>
        </router-link>
        <router-link :to="`/s/users`" class="favorite-tab" tag="li">
          <a class="has-text-centered">
            <span class="label-name">ユーザー</span>
          </a>
        </router-link>
      </ul>
    </div>

    <transition name="slide-fade" mode="out-in">
      <div>commign soon...</div>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    computed: {
      urlUserId() {
      },
      isSelf() {
      }
    },
    watch: {
    },
    created() {
    },
    methods: {
      refresh() {
      },
      refreshThemes() {
      },
      openEditModal() {
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #search-index {
    // background-color: $bg-color-main;
    background-color: white;

    .userpage-header {
      background-color: white;

      .user-profile {
        max-width: $width;
        margin-left: auto;
        margin-right: auto;
        padding: 1rem .5rem .5rem;
        border-bottom: $border-style;

        .image {
          img {
            height: 100%;
          }
        }
        .content {
          margin-bottom: 0;

          .user-name {
            margin-bottom: .3rem;
          }
          .user-bio {
            margin-top: .3rem;
          }
          .icon.is-small i {
            font-size: $size-5;
          }
        }
      }
      .tabs {
        max-width: $width;
        margin-left: auto;
        margin-right: auto;

        > ul {
          border-bottom-color: transparent;

          li {
            a {
              flex-direction: column;
              line-height: .7;
              border-bottom-width: 0;

              .label-name {
                font-weight: bold;
              }
              .label-count {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }
  }
</style>
