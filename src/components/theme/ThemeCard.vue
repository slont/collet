<template>
  <div class="theme-card card">
    <div class="card-image">
      <figure class="image is-16by9">
        <img :src="theme.image" v-if="theme.image">
        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" v-else>
      </figure>
      <div class="dark-mask" @click="$router.push(`/u/${theme.createdUser.id}/${theme.id}`)">
        <span class="private-icon icon" v-if="theme.private"><i class="material-icons">lock</i></span>

        <div class="title is-6 has-text-white">{{ theme.title }}</div>
        <div class="user-profile is-size-7">
          <figure class="image is-32x32" v-if="theme.createdUser.image">
            <img class="circle" :src="theme.createdUser.image">
          </figure>
          <div>
            <div @click.stop="$router.push(`/u/${theme.createdUser.id}`)">
              <span class="user-name has-text-white has-text-weight-bold">
                {{ theme.createdUser.name }}</span><span class="user-id has-text-grey-lighter">@{{ theme.createdUser.id }}</span>
            </div>
            <div class="updated-at has-text-grey-lighter">{{ theme.updatedAt && theme.updatedAt.format('YYYY/MM/DD HH:mm') }}</div>
          </div>
        </div>
      </div>

      <a class="add-item-button button is-info is-rounded" v-if="isMyTheme && visibleAddItem">カレット新規追加</a>
    </div>

    <div class="card-content media">
      <div class="media-content">
        <div class="tags" v-if="theme.tags.length">
          <router-link v-for="tag in theme.tags" class="tag" :key="tag.name"
             :to="`/tag?name=${tag.name}`">#{{ tag.name }}</router-link>
        </div>

        <div class="theme-description content is-size-7" v-if="theme.description">{{ theme.description }}</div>

        <nav class="actions level is-mobile">
          <div class="level-left">
            <a class="favorite-action level-item">
              <span class="icon" @click.stop.prevent="onClickFavorite">
                <i class="favorite material-icons" v-if="theme.favorite">favorite</i>
                <i class="material-icons" v-else>favorite_border</i>
              </span>
              <span class="favorite-count count has-text-weight-bold" v-if="theme.favoriteCount">{{ theme.favoriteCount }}</span>
            </a>
            <a class="item-action level-item">
              <span class="icon"><i class="material-icons">assignment</i></span>
              <span class="item-count count has-text-weight-bold">{{ theme.itemCount }}</span>
            </a>
          </div>
          <div class="level-right">
            <a class="edit-action level-item">
              <span class="icon" @click.stop.prevent="$emit('open-edit-modal')" v-if="isMyTheme">
                <i class="material-icons">more_horiz</i>
              </span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'

  export default {
    props: {
      theme: Object,
      visibleAddItem: Boolean
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      urlUserId() {
        return this.$route.params.userId
      },
      isMyTheme() {
        return this.$store.state.user.id === this.theme.createdUser.id
      }
    },
    methods: {
      onClickFavorite() {
        if (this.loggedIn) {
          this.doFavorite().then(res => {
            this.theme.favoriteCount += this.theme.favorite ? -1 : 1
            this.theme.favorite = !this.theme.favorite
          })
        } else {
          this.$confirm('アカウントを作成すると、テーマをお気に入りに追加できるようになります！', '', {
            type: 'info',
            showCancelButton: false,
            showConfirmButton: false
          })
        }
      },
      doFavorite() {
        if (this.theme.favorite) {
          return new ThemeModel().deleteFavorite(this.theme.id, this.user.id)
        } else {
          return new ThemeModel().updateFavorite(this.theme.id, this.user.id)
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .theme-card {
    .card-image {
      overflow: visible;

      .image {
        overflow: hidden;
      }
      .dark-mask {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 1rem;
        background: linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .6));
        transition: all .3s ease;

        &:hover {
          background: linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .7));
          cursor: pointer;
        }
        .private-icon {
          position: absolute;
          top: .25rem;
          left: 1rem;
          height: 3rem;
          color: #e8e8e8;
        }
        .title {
          margin: 0;
        }
        .title {
          max-height: 80px;
          width: 100%;
          margin-bottom: 1rem;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          color: white;

          &:hover {
            text-decoration: underline;
          }
        }
        .user-profile {
          display: flex;
          align-items: center;
          cursor: pointer;

          .image {
            margin-right: .5em;

            img {
              height: 100%;
            }
          }
          .user-name {
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      .add-item-button,
      .add-button {
        position: absolute;
        bottom: 1em;
        right: 1em;

        &:not(:hover) {
          color: #409eff;
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }
    }
    .card-content.media {
      .media-content {
        overflow: initial;

        .tags {
          margin-bottom: 0;
        }
        .theme-description + .actions {
          padding-top: .5em;
          border-top: $border-style;
        }
        .actions {
          .level-item {
            display: flex;
            align-items: center;

            .material-icons {
              color: darkgrey;
            }
            .count {
              margin-left: .25rem;
              margin-bottom: -.25rem;
              color: #4a4a4a;
            }
          }
          .favorite-action {
            .material-icons {
              &.favorite {
                color: deeppink;
              }
            }
            .favorite-count {
              margin-left: .25rem;
              margin-bottom: -.25rem;
              color: #4a4a4a;
            }
            &:hover {
              opacity: .8;
            }
          }
          .edit-action {
            margin-right: 0;
            color: #4a4a4a;
          }
        }
      }
    }
  }
</style>
