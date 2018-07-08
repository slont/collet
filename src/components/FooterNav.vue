<template>
  <nav id="footer-nav" class="navbar is-fixed-bottom" :class="{ 'is-active': activeFooter }">
    <!-- ログイン済 -->
    <template v-if="loggedIn">
      <div class="navbar-brand logged-in">
        <router-link to="/" class="navbar-item" exact>
          <span class="icon"><i class="fas fa-home"></i></span>
          <span class="subtitle is-7 has-text-weight-bold">Home</span>
        </router-link>

        <a @click="onClickAdd" class="edit-button navbar-item button is-primary is-rounded">
          <span class="icon is-size-3"><i class="fas fa-pencil-alt"></i></span>
        </a>

        <router-link :to="`/u/${user.id}`" class="navbar-item user-profile" exact>
          <figure class="image circle is-28x28 flexbox" v-if="user.image">
            <user-image :src="user.image"/>
          </figure>
          <span class="icon" v-else><i class="far fa-user-circle"></i></span>
          <span class="subtitle is-7 has-text-weight-bold">My Page</span>
        </router-link>
      </div>
    </template>
    <!-- 未ログイン -->
    <template v-else>
      <div class="navbar-brand logged-out has-text-centered">
        <router-link to="/signup" class="navbar-item button is-primary is-rounded">
          新規登録
        </router-link>

        <a @click="onClickTempAdd" class="edit-button navbar-item button is-primary is-rounded">
          <span class="icon is-size-3"><i class="fas fa-pencil-alt"></i></span>
        </a>

        <router-link :to="`/signin?redirect=${encodeURIComponent($route.path)}`"
                     class="navbar-item button is-primary is-outlined is-rounded">
          ログイン
        </router-link>
      </div>
    </template>

    <theme-create-modal ref="themeCreateModal" @refresh=""/>
    <item-create-modal ref="itemCreateModal" @refresh=""/>
  </nav>
</template>

<script>
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ItemCreateModal from '@/components/item/ItemCreateModal'

  export default {
    components: {ThemeCreateModal, ItemCreateModal},
    computed: {
      activeFooter: ({$store}) => $store.state.activeFooter,
      user: ({$store}) => $store.state.user
    },
    methods: {
      onClickAdd() {
        if (this.$store.state.theme.id) {
          this.$router.push(`/m/createItem/${this.$store.state.theme.id}`)
        } else {
          this.$refs.themeCreateModal.open()
        }
      },
      onClickTempAdd() {
        this.$router.push(`/m/editTempItem`)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #footer-nav {
    box-shadow: $box-shadow;
    z-index: 20;

    .navbar-brand {
      max-height: 3.25rem;
      align-items: center;
      justify-content: space-evenly;

      .navbar-item {
        flex-direction: column;

        .icon {
          font-size: $size-3;
        }
        .image {
          img {
            max-height: initial;
          }
        }
      }
      .edit-button {
        justify-content: center;
        height: 58px;
        width: 58px;
        margin: -3px 6px 18px;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 1);

        &:hover {
          background-color: $primary-dark;
        }
        .icon {
          margin-left: -.35em;
        }
      }
      &.logged-in {
        .navbar-item:not(.button) {
          justify-content: flex-end;
          height: 3.25rem;
          width: 20%;
          padding: 5px 0;

          &.user-profile {
            .image {
              min-height: 28px;
            }
          }
          &.router-link-active,
          &.is-active,
          &:hover {
            &:not(.button) {
              border-bottom: 3px solid $primary;
              padding-bottom: 2px;
              background: transparent;

              span {
                color: $primary;
              }
            }
          }
        }
      }
      &.logged-out {
        .button:not(.edit-button) {
          font-weight: bold;
          padding: 1.125em 3em;
        }
      }
    }
  }
</style>
