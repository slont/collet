<template>
  <div id="header-nav">
    <nav class="navbar is-primary">
      <div class="navbar-brand">
        <span class="navbar-item logo" @click="$router.push(`/`)">
          <img src="/static/img/colette-logo.png" alt="Colette">
        </span>

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
          <router-link :to="`/${user.name}`" class="navbar-item" v-if="loggedIn">
            マイページ
          </router-link>
        </div>

        <div class="navbar-end">
          <div class="account-item navbar-item" v-if="loggedIn">
            <dropdown ref="accountDropdown">
              <template slot="trigger">
                <span class="user-name is-size-7">{{ user.name }}</span>
                <img :src="user.image" class="circle" v-if="user.image"/>
                <span class="icon" v-else><i class="material-icons">arrow_drop_down</i></span>
              </template>

              <a @click="$router.push('/settings/profile')" class="dropdown-item">
                設定
              </a>
              <hr class="dropdown-divider">
              <a @click="signout" class="dropdown-item">
                サインアウト
              </a>
            </dropdown>
          </div>
          <div class="navbar-item" v-else>
            <div class="field is-grouped">
              <p class="control">
                <nav class="breadcrumb">
                  <ul>
                    <li><router-link :to="`/signin?redirect=${encodeURIComponent($route.path)}`">ログイン</router-link></li>
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
  import Dropdown from '@/components/Dropdown'

  export default {
    components: { Dropdown },
    data() {
      return {
        activeNavbarMenu: false
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      loggedIn() {
        return this.$store.state.loggedIn
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
    background-color: $primary;

    .navbar {
      max-width: $width;
      margin: 0 auto;

      .navbar-brand {
        .logo {
          padding-left: 0;
          padding-right: 0;
          cursor: pointer;

          img {
            max-height: 2.25rem;
          }
        }
      }
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
        .account-item {
          .dropdown-trigger {
            display: flex;
            align-items: center;
            cursor: pointer;

            .user-name {
              margin-right: .25rem;
            }
            img {
              height: 2.25rem;
              max-height: 2.25rem;
              width: 2.25rem;
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
