<template>
  <nav id="header-nav" class="navbar is-fixed-top" :class="{ 'is-active': activeHeader }">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-item logo" @click="$router.push(`/`)">
          <img class="cullet-logo" src="/static/img/cullet-logo_orange.png" alt="Colette">
        </div>

        <div class="navbar-item field search-field is-hidden-tablet" v-if="!loggedIn">
          <div class="control has-icons-right">
            <input v-model="query" class="input is-rounded"
                 placeholder="キーワード検索"/>
            <span class="icon is-small is-right"><i class="fas fa-search"></i></span>
          </div>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start is-size-5 has-text-weight-bold">
          <router-link :to="`/u/${user.id}`" class="navbar-item text-color-weak" v-if="loggedIn">
            <span>マイページ</span>
          </router-link>
        </div>

        <div class="navbar-end">
          <template v-if="loggedIn">
            <div class="account-item navbar-item">
              <dropdown ref="accountDropdown">
                <template slot="trigger">
                  <div class="user-name">
                    <div class="is-size-7">{{ user.name }}</div>
                    <div class="is-size-8 text-color-weak">@{{ user.id }}</div>
                  </div>
                  <user-image :src="user.image" class="circle" v-if="user.image"/>
                  <span class="icon" v-else><i class="material-icons">arrow_drop_down</i></span>
                </template>

                <router-link to="/settings/profile" class="dropdown-item">
                  設定
                </router-link>
                <hr class="dropdown-divider">
                <a @click="signout" class="dropdown-item">
                  <span class="icon"><i class="material-icons">exit_to_app</i></span>
                  サインアウト
                </a>
              </dropdown>
            </div>
          </template>
          <template v-else>
            <div class="navbar-item">
              <div class="field is-grouped">
                <p class="control">
                  <router-link class="button is-primary" to="/signup">新規登録</router-link>
                  <router-link class="button is-primary is-outlined" :to="`/signin?redirect=${encodeURIComponent($route.path)}`">ログイン</router-link>
                </p>
              </div>
            </div>
          </template>
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
        query: ''
      }
    },
    computed: {
      activeHeader() {
        return this.$store.state.activeHeader
      },
      user() {
        return this.$store.state.user
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
    background-color: white;
    box-shadow: $box-shadow;
    z-index: 20;

    .container {
      max-width: $width;

      .navbar-brand {
        .logo {
          padding-left: .75rem;
          padding-right: 0;
          cursor: pointer;

          img {
            max-height: 2.25rem;
          }
        }
        .search-field {
          margin-left: auto;
          padding-right: .5em;

          .input {
            background: transparent;
            color: white;
            border: 1px solid #e07b00;
          }
        }
      }
      .navbar-menu {
        .navbar-start {
          .icon {
            font-size: $size-4;
          }
        }
        .navbar-end {
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
        /* SP用 */
        &.is-hidden-tablet.is-active {
          .navbar-item {
            display: flex;
            align-items: center;

            .icon {
              margin-right: .5em;
            }
          }
        }
      }
    }
  }
</style>
