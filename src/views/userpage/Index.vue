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
            <div class="title is-4">{{ user.name }}</div>
            <div class="title is-7">{{ urlUserId }}</div>
            <p>{{ user.biography }}</p>
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

    <div class="themes">
      <div class="columns is-multiline">
        <div v-for="theme in themes" class="column is-one-third-tablet" :key="theme.id">
          <theme-card :theme="theme" @open-edit-modal="$refs.themeEditModal.open(theme)"></theme-card>
        </div>
      </div>
    </div>

    <a @click="$refs.themeCreateModal.open()" class="button button-create is-float is-primary circle">
      <i class="material-icons">add</i>
    </a>

    <theme-create-modal ref="themeCreateModal" @refresh="refresh"></theme-create-modal>
    <theme-edit-modal ref="themeEditModal" @refresh="refresh"></theme-edit-modal>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
  import ThemeModel from '@/models/Theme'
  import FavoriteModel from '@/models/Favorite'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'

  export default {
    components: { ThemeCard, ThemeCreateModal, ThemeEditModal },
    data() {
      return {
        user: {
          id: '',
          name: '',
          biography: '',
          image: ''
        },
        themes: []
      }
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        new UserModel().findOne(this.urlUserId).then(res => {
          this.user = res
          return new ThemeModel().find({
            userId: this.user.id,
            p: 0,
            s: 20
          })
        }).then(res => {
          this.themes = res
          return new FavoriteModel().find({
            themeIds: res.map(theme => theme.id),
            userId: this.user.id
          })
        }).then(res => {
          this.themes.forEach((theme, i) => Object.assign(theme, {
            favorite: !!res[i].themeId
          }))
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
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

          .title {
            margin-bottom: .5rem;
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
          }
        }
      }
    }
    .themes {
      width: $width;
      margin: 0 auto;

      > .columns {
        padding-top: 1em;
      }
    }
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }
  }
</style>
