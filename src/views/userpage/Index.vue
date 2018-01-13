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
            <div class="">
              <span class="title is-4">{{ user.name }}</span>
              <span class="subtitle is-6">@{{ urlUserId }}</span>
            </div>
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
          <router-link :to="`/${urlUserId}`" tag="li" exact><a>テーマ一覧</a></router-link>
          <router-link :to="`/${urlUserId}/favorites`" tag="li"><a>お気に入り</a></router-link>
        </ul>
      </div>
    </header>

    <transition name="slide-fade" mode="out-in">
      <favorites @open-edit-modal="openEditModal" v-if="$route.path.endsWith('/favorites')"></favorites>
      <themes @open-edit-modal="openEditModal" v-else></themes>
    </transition>

    <a @click="$refs.themeCreateModal.open()" class="button button-create is-float is-primary circle">
      <i class="material-icons">add</i>
    </a>

    <theme-create-modal ref="themeCreateModal" @refresh="refresh"></theme-create-modal>
    <theme-edit-modal ref="themeEditModal" @refresh="refresh"></theme-edit-modal>
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
          this.user = res
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-index {
    .userpage-header {
      background-color: white;

      .user-profile {
        width: $width;
        margin-left: auto;
        margin-right: auto;
        padding: 1rem .5rem .5rem;
        border-bottom: $border-style;

        .content {
          margin-bottom: 0;

          .user-bio {
            margin-top: .5rem;
          }
        }
      }
      .tabs {
        width: $width;
        margin-left: auto;
        margin-right: auto;

        > ul {
          border-bottom-color: transparent;

          li {
            a {
              border-bottom-width: 0;
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
