<template>
  <div id="userpage-index">
    <header class="userpage-header header-shadow">
      <article class="user-profile media">
        <figure class="media-left" v-if="user.image">
          <p class="image is-64x64">
            <img :src="user.image" class="circle">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <div class="user-name">
              <span class="title is-4">{{ user.name }}</span>
              <span class="subtitle is-6">@{{ urlUserId }}</span>
            </div>
            <router-link to="/settings/profile" v-if="isSelf"
                         class="profile-edit-button button is-info is-outlined is-small">
              プロフィール編集
            </router-link>
            <router-link to="/settings" v-if="isSelf"
                         class="settings-button button is-info is-outlined is-small">
              <span class="icon is-small"><i class="material-icons">settings</i></span>
            </router-link>
            <p class="user-bio">{{ user.biography }}</p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a class="level-item">
                <span class="icon is-small"><i class="fa fa-reply"></i></span>
              </a>
              <a class="level-item">
                <span class="icon is-small"><i class="fa fa-retweet"></i></span>
              </a>
              <a class="level-item">
                <span class="icon is-small"><i class="fa fa-heart"></i></span>
              </a>
            </div>
          </nav>
        </div>
      </article>
      <div class="tabs">
        <ul>
          <router-link :to="`/${urlUserId}`" class="theme-tab" tag="li" exact>
            <a class="has-text-centered">
              <span class="label-name is-size-7">テーマ</span><br/>
              <span class="label-count">{{ user.themeCount }}</span>
            </a>
          </router-link>
          <router-link :to="`/${urlUserId}/favorites`" class="favorite-tab" tag="li">
            <a class="has-text-centered">
              <span class="label-name is-size-7">お気に入り</span><br/>
              <span class="label-count">{{ user.favoriteCount }}</span>
            </a>
          </router-link>
        </ul>
      </div>
    </header>

    <transition name="slide-fade" mode="out-in">
      <favorites ref="child" @open-edit-modal="openEditModal" v-if="$route.path.endsWith('/favorites')"/>
      <themes ref="child" @open-edit-modal="openEditModal" @refresh="refresh" v-else/>
    </transition>

    <a @click="$refs.themeCreateModal.open()" v-if="loggedIn"
       class="button button-create is-float is-primary circle is-hidden-mobile">
      <i class="material-icons">add</i>
    </a>

    <theme-create-modal ref="themeCreateModal" @refresh="refreshThemes"/>
    <theme-edit-modal ref="themeEditModal" @refresh="refreshThemes"/>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import Themes from './Themes'
  import Favorites from './Favorites'

  export default {
    components: { ThemeCard, ThemeCreateModal, ThemeEditModal, Themes, Favorites },
    data() {
      return {
        user: {
          id: '',
          name: '',
          biography: '',
          image: ''
        }
      }
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      },
      isSelf() {
        return this.$store.state.user.id === this.urlUserId
      },
      loggedIn() {
        return this.$store.state.loggedIn
      }
    },
    watch: {
      '$route.params.userId': 'refresh'
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        new UserModel().findOne(this.urlUserId).then(res => {
          this.user = res.data
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      refreshThemes() {
        this.$refs.child.refresh()
      },
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-index {
    padding-top: $header-nav-height;

    .userpage-header {
      background-color: white;

      .user-profile {
        align-items: center;
        max-width: $width;
        margin-left: auto;
        margin-right: auto;
        padding: 1rem .5rem .5rem;
        border-bottom: $border-style;

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
            &.router-link-active {
              @extend .is-active;
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
