<template>
  <div id="settings-index">
    <aside class="settings-menu menu" :class="{ 'is-root': isRoot }">
      <p class="menu-label">
        アカウント
      </p>
      <ul class="menu-list">
        <router-link to="/settings/profile" tag="li">
          <a>
            <span>プロフィール</span>
            <span class="icon is-hidden-tablet"><i class="material-icons">chevron_right</i></span>
          </a>
        </router-link>

        <li class="flexbox">
          <a class="field flexbox">
            プッシュ通知
          </a>
          <input v-model="activePushNotification" type="checkbox" class="switch is-rtl is-rounded is-primary"/>
          <label class="push-notification is-justify-end" @click="activePushNotification = !activePushNotification"></label>
        </li>
      </ul>
      <div class="divider"></div>

      <p class="menu-label">
        その他
      </p>
      <ul class="menu-list">
        <li @click="signout">
          <a><span>サインアウト</span></a>
        </li>
      </ul>
    </aside>

    <transition name="slide-fade" mode="out-in">
      <router-view/>
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
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #settings-index {
    display: flex;

    .settings-menu {
      width: 200px;
      min-width: 200px;
      margin-right: 1rem;
      padding: 1em 0;

      .menu-label {
        padding-left: .75em;
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

    @media screen and (max-width: 768px) {
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
