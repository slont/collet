<template>
  <nav id="footer-nav" class="navbar is-fixed-bottom">
    <!-- ログイン済 -->
    <template v-if="loggedIn">
      <div class="navbar-brand logged-in">
        <router-link to="/" class="navbar-item" exact>
          <span class="icon"><i class="material-icons">home</i></span>
          <span class="subtitle is-7">ホーム</span>
        </router-link>

        <router-link to="/search" class="navbar-item">
          <span class="icon"><i class="material-icons">search</i></span>
          <span class="subtitle is-7">検索</span>
        </router-link>

        <a @click="onClickAdd" class="navbar-item button is-primary is-rounded is-outlined">
          <span class="icon"><i class="material-icons">add</i></span>
        </a>

        <router-link :to="`/${user.name}/favorites`" class="navbar-item">
          <span class="icon"><i class="material-icons">star_border</i></span>
          <span class="subtitle is-7">お気に入り</span>
        </router-link>

        <router-link :to="`/${user.name}`" class="navbar-item" exact>
          <span class="icon"><i class="material-icons">account_circle</i></span>
          <span class="subtitle is-7">マイページ</span>
        </router-link>
      </div>
    </template>
    <!-- 未ログイン -->
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

    <theme-create-modal ref="themeCreateModal" @refresh=""/>
    <item-create-modal ref="itemCreateModal" @refresh=""/>
  </nav>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ItemCreateModal from '@/components/item/ItemCreateModal'

  export default {
    components: { ThemeCreateModal, ItemCreateModal },
    data() {
      return {
        themes: []
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
      fetchThemes() {
        new ThemeModel().findByNew({
          p: 0,
          s: 1
        }).then(res => {
          this.themes = res.data
        })
      },
      async onClickAdd() {
        await new ThemeModel().findByNew({
          p: 0,
          s: 1
        }).then(res => {
          this.themes = res.data
        })

        if (this.themes.length) {
          this.$refs.itemCreateModal.open(this.themes[0])
        } else {
          this.$refs.themeCreateModal.open()
        }
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
      }
      &.logged-in {
        .navbar-item {
          width: 20%;
          padding-left: 0;
          padding-right: 0;
        }
        .button {
          height: 40px;
          width: 40px;
          margin: auto 12px;
        }
      }
      &.logged-out {
        .button {
          padding: 1.125em 4em;
        }
      }
    }
  }
</style>
