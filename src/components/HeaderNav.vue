<template>
  <div id="header-nav">
    <nav class="navbar is-info">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
        </a>

        <a class="navbar-item is-hidden-desktop" href="https://github.com/jgthms/bulma" target="_blank">
          <span class="icon" style="color: #333;">
            <i class="fa fa-lg fa-github"></i>
          </span>
        </a>

        <a class="navbar-item is-hidden-desktop" href="https://twitter.com/jgthms" target="_blank">
          <span class="icon" style="color: #55acee;">
            <i class="fa fa-lg fa-twitter"></i>
          </span>
        </a>

        <div class="navbar-burger burger" :class="{ 'is-active': activeNavbarMenu }"
             @click="activeNavbarMenu = !activeNavbarMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': activeNavbarMenu }">
        <div class="navbar-start">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" href="/documentation/overview/start/">
              Docs
            </a>
            <div class="navbar-dropdown is-boxed">
              <a class="navbar-item " href="/documentation/overview/start/">
                Overview
              </a>
              <a class="navbar-item " href="https://bulma.io/documentation/modifiers/syntax/">
                Modifiers
              </a>
              <a class="navbar-item " href="https://bulma.io/documentation/columns/basics/">
                Columns
              </a>
              <a class="navbar-item " href="https://bulma.io/documentation/layout/container/">
                Layout
              </a>
              <a class="navbar-item " href="https://bulma.io/documentation/form/general/">
                Form
              </a>
              <a class="navbar-item " href="https://bulma.io/documentation/elements/box/">
                Elements
              </a>

              <a class="navbar-item is-active" href="https://bulma.io/documentation/components/breadcrumb/">
                Components
              </a>

              <hr class="navbar-divider">
              <div class="navbar-item">
                <div>
                  <p class="is-size-6-desktop">
                    <strong>0.6.0</strong>
                  </p>

                  <small>
                    <a class="bd-view-all-versions" href="https://versions.bulma.io/">View all versions</a>
                  </small>

                </div>
              </div>
            </div>
          </div>
          <router-link to="/mypage" class="navbar-item">
            マイページ
          </router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item" v-if="$store.state.loggedIn">
            <div class="dropdown is-hoverable">
              <div class="dropdown-trigger">
                <button class="button is-info is-inverted is-outlined">
                  <i class="material-icons">person_outline</i>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a href="#" class="dropdown-item">
                    Dropdown item
                  </a>
                  <a class="dropdown-item">
                    Other dropdown item
                  </a>
                  <a href="#" class="dropdown-item is-active">
                    Active dropdown item
                  </a>
                  <a href="#" class="dropdown-item">
                    Other dropdown item
                  </a>
                  <hr class="dropdown-divider">
                  <a @click="signout" href="#" class="dropdown-item">
                    サインアウト
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="navbar-item" v-else>
            <div class="field is-grouped">
              <p class="control">
                <nav class="breadcrumb">
                  <ul>
                    <li><router-link to="/signin">ログイン</router-link></li>
                    <li><router-link to="/signup">新規登録</router-link></li>
                  </ul>
                </nav>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeNavbarMenu: false
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
  #header-nav {
    background-color: $info;

    .navbar {
      max-width: $width;
      margin: 0 auto;

      .navbar-end {
        .breadcrumb {
          $color: white;
          a {
            color: $color;

            &:hover {
              color: darken($color, 15%);
            }
          }
        }
      }
      .router-link-active {
        @extend .is-active;
      }
    }
  }
</style>