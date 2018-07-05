<template>
  <div id="settings-index" class="fullheight bg-white">
    <aside class="settings-menu menu" :class="{ 'is-root': isRoot }">
      <p class="menu-label">
        アカウント
      </p>
      <ul class="menu-list">
        <router-link to="/settings/profile" tag="li">
          <a>
            <span>プロフィール</span>
            <span class="icon is-hidden-tablet"><i class="fas fa-angle-right fa-lg"></i></span>
          </a>
        </router-link>

        <router-link to="/settings/password" tag="li">
          <a>
            <span>パスワード設定</span>
            <span class="icon is-hidden-tablet"><i class="fas fa-angle-right fa-lg"></i></span>
          </a>
        </router-link>
      </ul>
      <div class="divider"></div>

      <p class="menu-label">
        その他
      </p>
      <ul class="menu-list">
        <li>
          <a href="/terms-of-service" target="_blank">利用規約</a>
        </li>
        <li>
          <a href="/privacy-policy" target="_blank">プライバシーポリシー</a>
        </li>
        <li @click="signout">
          <a><span>サインアウト</span></a>
        </li>
      </ul>
    </aside>

    <transition name="slide-fade" mode="out-in">
      <router-view class="settings-content"/>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activePushNotification: true
      }
    },
    computed: {
      isRoot() {
        return '/settings' === this.$route.path
      }
    },
    methods: {
      signout() {
        this.$store.dispatch('signout').then(() => {
          this.$router.push('/')
        }).catch(() => {
          this.$router.push('/')
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #settings-index {
    display: flex;
    max-width: $width;
    margin: auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;

    .settings-menu {
      width: 200px;
      min-width: 200px;
      margin-right: 1rem;
      padding: 1em 0;

      .menu-label {
        padding-left: .75em;
      }
      .menu-list li a {
        padding: .75rem 1rem;
      }
      .divider {
        margin: .5em;
        height: 1px;
        background-color: $border;
      }
      .push-notification {
        align-self: start;
        margin-top: .5em;
        margin-right: 1em;
      }
    }
    .settings-content {
      flex: 1;
    }

    @media screen and (max-width: 768px) {
      &.container {
        height: calc(100vh - #{$header-nav-height + $footer-nav-height});
      }
      .settings-menu {
        display: none;
        height: 100%;
        width: 100%;
        min-width: 100%;
        margin: 0;
        background-color: white;

        &.is-root {
          display: initial;
        }
        .menu-list li a {
          display: flex;
          align-items: center;

          .icon {
            color: darkgrey;
            margin-left: auto;
          }
        }
      }
      .columns {
        margin: 0;

        .column {
          padding: 0;
        }
      }
    }
  }
</style>
