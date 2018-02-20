<template>
  <nav id="header-nav" class="navbar is-primary is-fixed-top">
    <div class="container">
      <div class="navbar-brand">
        <span class="navbar-item logo is-hidden-mobile" @click="$router.push(`/`)">
          <img src="/static/img/cullet.png" alt="Colette">
        </span>

        <router-link to="/" class="navbar-item navbar-item-icon is-hidden-desktop" exact>
          <span class="icon"><i class="material-icons">home</i></span>
          <span class="subtitle is-7">ホーム</span>
        </router-link>

        <router-link :to="`/${user.name}`" class="navbar-item navbar-item-icon is-hidden-desktop" v-if="loggedIn">
          <span class="icon"><i class="material-icons">account_circle</i></span>
          <span class="subtitle is-7">マイページ</span>
        </router-link>

        <div class="navbar-burger burger" :class="{ 'is-active': activeNavbarMenu }"
             @click="activeNavbarMenu = !activeNavbarMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': activeNavbarMenu }">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item" exact>
            <span class="icon"><i class="material-icons">home</i></span>
            <span>ホーム</span>
          </router-link>
          <router-link :to="`/${user.name}`" class="navbar-item" v-if="loggedIn">
            <span class="icon"><i class="material-icons">account_circle</i></span>
            <span>マイページ</span>
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
    </div>
  </nav>
</template>

<script>
  import Dropdown from '@/components/Dropdown'
  // const HEADER_HEIGHT = 46

  export default {
    components: { Dropdown },
    data() {
      return {
        // scrolledVal: 0,
        // headerPos: 0,
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
    // created() {
    //   window.addEventListener('scroll', this.handleScroll)
    // },
    // destroyed() {
    //   window.removeEventListener('scroll', this.handleScroll)
    // },
    methods: {
      // handleScroll(e) {
      //   const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      //   let diff = this.scrolledVal - scrollTop
      //   if (this.scrolledVal < scrollTop) {
      //     this.headerPos = Math.max(-HEADER_HEIGHT, this.headerPos + diff)
      //   } else {
      //     diff = Math.sign(diff) * Math.min(10, Math.abs(diff))
      //     this.headerPos = Math.min(0, this.headerPos + diff)
      //   }
      //   this.scrolledVal = scrollTop
      // },
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
    height: $header-nav-height;
    background-color: $primary;
    box-shadow: $box-shadow;

    .container {
      max-width: $width;

      .navbar-brand {
        .logo {
          padding-left: 0;
          padding-right: 0;
          cursor: pointer;

          img {
            max-height: 2.25rem;
          }
        }
        .navbar-item-icon {
          flex-direction: column;

          .subtitle {
            color: white;
          }

          &.router-link-active,
          &.is-active,
          &:hover {
            padding-top: 5px;
            padding-bottom: 0;
            margin-bottom: 0;
            background-color: inherit;
            border-bottom: 3px solid white;
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
    }
  }
</style>
