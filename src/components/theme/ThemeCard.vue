<template>
  <div class="theme-card card">
    <div class="card-image">
      <figure class="image is-16by9">
        <img :src="theme.image" v-if="theme.image">
        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" v-else>
      </figure>
      <div class="dark-mask" @click="$router.push(`/${theme.createdUser.id}/${theme.id}`)">
        <div class="favorite-action" @click.stop.prevent="onClickFavorite">
          <span class="icon">
            <i class="favorite material-icons" v-if="theme.favorite">star</i>
            <i class="material-icons" v-else>star_border</i>
          </span>
          <span class="favorite-count" v-if="theme.favoriteCount">{{ theme.favoriteCount }}</span>
        </div>

        <div class="edit-action" @click.stop.prevent="$emit('open-edit-modal')" v-if="isMyPage">
          <span class="icon"><i class="material-icons">more_horiz</i></span>
        </div>

        <div class="title is-5">{{ theme.title }}</div>
        <div class="user-profile" @click="$router.push(`/${theme.createdUser.id}`)">
          <figure class="image is-16x16" v-if="theme.createdUser.image">
            <img class="circle" :src="theme.createdUser.image">
          </figure>
          <span class="user-name">{{ theme.createdUser.name }}</span>
          <span class="updated-at">- {{ theme.updatedAt && theme.updatedAt.format('YYYY/MM/DD') }}</span>
        </div>
        <div class="field tags-field" v-if="theme.tags.length">
          <div class="control tags">
            <span v-for="tag in theme.tags" class="tag is-primary">{{ tag.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-content">
      <div class="media">
        <div class="media-content">
          {{ theme.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'

  export default {
    props: ['theme'],
    computed: {
      user() {
        return this.$store.state.user
      },
      urlUserId() {
        return this.$route.params.userId
      },
      isMyPage() {
        return this.$store.state.user.id === this.urlUserId
      }
    },
    methods: {
      onClickFavorite() {
        this.clickFavorite().then(res => {
          this.theme.favoriteCount += this.theme.favorite ? -1 : 1
          this.theme.favorite = !this.theme.favorite
        })
      },
      clickFavorite() {
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
      overflow: hidden;

      .dark-mask {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        padding: .5rem 1rem;
        transition: all .3s ease;

        .favorite-action {
          display: flex;
          align-items: center;
          position: absolute;
          top: .5rem;
          left: 0;
          padding: .25rem .4rem .25rem .25rem;
          background-color: rgba(0, 0, 0, .5);
          border: 1px solid white;
          border-left: none;
          border-bottom-right-radius: 5px;
          border-top-right-radius: 5px;

          .material-icons {
            font-size: 18px;
            color: rgba(255, 255, 255, .6);

            &.favorite {
              color: #ebeb00;
            }
          }
          .favorite-count {
            margin-bottom: -.25rem;
            color: white;
          }
          &:hover {
            opacity: .8;
          }
        }
        .edit-action {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          right: 0;
          height: 3rem;
          width: 3rem;
          color: #e8e8e8;

          &:hover {
            opacity: .5;
          }
        }
        .title,
        .subtitle {
          color: white;
          margin: 0;
        }
        .title {
          max-height: 62px;
          width: 100%;
          margin: 0;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          color: white;
        }
        .user-profile {
          font-size: .75rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: white;

          > :not(:last-child) {
            margin-right: .3rem;
          }
        }
        > :not(:last-child) {
          margin-bottom: .25rem;
        }
        .subtitle {
          color: white;
          margin: .3rem 0 0;
        }
        &:hover {
          background-color: rgba(0, 0, 0, .4);
          cursor: pointer;
        }
      }
    }
    .card-content {
      .media {
        .media-content {
          height: 6rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
        }
      }
      .theme-actions {
        display: flex;

        .theme-action {
          display: inline-flex;
          align-items: center;
          line-height: 1;

          .icon {
            margin-right: .3rem;

            i {
              font-size: $size-4;
            }
          }
        }
        .favorite-action {
          cursor: pointer;

          .favorite {
            color: #ebeb00;
          }
        }
      }
    }
  }
</style>
