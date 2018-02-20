<template>
  <nav id="footer-nav" class="navbar is-fixed-bottom">
    <template v-if="loggedIn">
      <div class="navbar-brand logged-in">
        <router-link to="/" class="navbar-item navbar-item-icon" exact>
          <span class="icon"><i class="material-icons">home</i></span>
          <span class="subtitle is-7">ホーム</span>
        </router-link>

        <router-link :to="`/${user.name}`" class="navbar-item navbar-item-icon" v-if="loggedIn">
          <span class="icon"><i class="material-icons">account_circle</i></span>
          <span class="subtitle is-7">マイページ</span>
        </router-link>
      </div>
    </template>
    <template v-else>
      <div class="navbar-brand logged-out">
        <router-link :to="`/signin?redirect=${encodeURIComponent($route.path)}`"
                     class="navbar-item button is-primary is-outlined is-rounded">
          ログイン
        </router-link>
        <router-link to="/signup"
                     class="navbar-item button is-primary is-rounded">
          新規登録
        </router-link>
      </div>
    </template>
  </nav>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.user
      },
      loggedIn() {
        return this.$store.state.loggedIn
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #footer-nav {
    box-shadow: $box-shadow;
    z-index: 20;

    .navbar-brand {
      align-items: center;
      justify-content: space-evenly;

      .navbar-item {
        flex-direction: column;

        &.router-link-active,
        &.is-active,
        &:hover {
          border-bottom: 3px solid $primary;
          background: transparent;

          span {
            color: $primary;
          }
        }
        &.button {
          padding: 1.125em 4em;
        }
      }
    }
  }
</style>
