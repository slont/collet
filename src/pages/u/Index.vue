<template>
  <div id="userpage-index" @scroll="infiniteScroll">
    <header class="userpage-header header-shadow">
      <article class="user-profile media">
        <figure class="media-left" v-if="user.image">
          <div class="image circle flexbox"><user-image :src="user.image"/></div>
        </figure>
        <div class="media-content">
          <div class="content">
            <div class="user-name">
              <span class="title is-4">{{ user.name }}</span><span class="subtitle is-6">@{{ urlUserId }}</span>
            </div>
            <router-link to="/settings/profile" v-if="loggedIn && isSelf"
                         class="profile-edit-button button is-info is-outlined is-small">
              プロフィール編集
            </router-link>
            <router-link to="/settings" v-if="loggedIn && isSelf"
                         class="settings-button button is-info is-outlined is-small">
              <span class="icon is-small"><i class="material-icons">settings</i></span>
            </router-link>
            <p class="user-bio" v-if="user.biography">{{ user.biography }}</p>
          </div>
        </div>
      </article>
      <div class="tabs is-centered">
        <ul>
          <router-link :to="`/u/${urlUserId}`" class="cullet-tab" tag="li" exact>
            <a class="has-text-centered">
              <span class="label-name">カレット</span><br/>
              <span class="label-count">{{ user.itemCount }}</span>
            </a>
          </router-link>
          <router-link :to="`/u/${urlUserId}/themes`" class="theme-tab" tag="li" exact>
            <a class="has-text-centered">
              <span class="label-name">テーマ</span><br/>
              <span class="label-count">{{ user.themeCount }}</span>
            </a>
          </router-link>
          <router-link :to="`/u/${urlUserId}/favorites`" class="favorite-tab" tag="li">
            <a class="has-text-centered">
              <span class="label-name">お気に入り</span><br/>
              <span class="label-count">{{ user.favoriteCount }}</span>
            </a>
          </router-link>
        </ul>
      </div>
    </header>

    <transition name="slide-fade" mode="out-in">
      <favorites ref="child" @open-edit-modal="openEditModal" v-if="$route.path.endsWith('/favorites')"/>
      <themes ref="child" @open-edit-modal="openEditModal" v-else-if="$route.path.endsWith('/themes')"/>
      <items ref="child" @open-edit-modal="openEditModal" v-else/>
    </transition>

    <a @click.stop="$refs.itemCreateModal.open" v-if="loggedIn"
       class="button button-create is-float is-primary circle is-hidden-mobile">
      <i class="material-icons">add</i>
    </a>

    <item-create-modal ref="itemCreateModal"/>
    <theme-edit-modal ref="themeEditModal" @refresh="refreshThemes"/>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
  import Items from './Items'
  import Themes from './Themes'
  import Favorites from './Favorites'

  export default {
    components: {ThemeCard, ItemCreateModal, ThemeEditModal, Items, Themes, Favorites},
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
      urlUserId: ({$route}) => $route.params.userId,
      isSelf: ({$store, urlUserId}) => $store.state.user.id === urlUserId
    },
    watch: {
      '$route.params.userId': 'refresh'
    },
    created() {
      if (this.isSelf) {
        Object.assign(this.user, new UserModel().deserialize(this.$store.state.user))
      }
      this.refresh()
    },
    methods: {
      refresh() {
        new UserModel().findOneWithReport(this.urlUserId).then(res => {
          this.user = res.data
          if (this.isSelf) {
            this.$store.commit('SET_USER', res.data)
          }
        }).catch(err => {
          console.log(err)
          this.$toast.open({
            message: 'データ取得に失敗しました',
            type: 'is-danger'
          })
        })
      },
      refreshThemes() {
        this.$refs.child.refresh()
      },
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      },
      infiniteScroll(event) {
        if (event.target.scrollHeight <= event.target.scrollTop + event.target.offsetHeight) {
          this.$refs.child.fetch()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-index {
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;

    &.container {
      height: calc(100vh - #{$header-nav-height});
    }
    .userpage-header {
      background-color: white;

      .user-profile {
        max-width: $width;
        margin-left: auto;
        margin-right: auto;
        padding: .5rem .75rem;
        border-bottom: $border-style;

        .media-left {
          margin-bottom: -1.75rem;

          .image {
            height: 5rem;
            width: 5rem;
            border: 5px solid #ebeded;
          }
        }
        .content {
          margin-bottom: 0;

          .user-bio {
            margin-top: .3rem;
            word-break: break-all;
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
                font-size: $size-7;
                font-weight: bold;
              }
              .label-count {
                font-size: $size-5;
                font-weight: bold;
              }
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
    @media screen and (max-width: 768px) {
      &.container {
        height: calc(100vh - #{$header-nav-height + $footer-nav-height});
      }
    }
  }
</style>
