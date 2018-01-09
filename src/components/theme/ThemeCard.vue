<template>
  <div class="theme-card card">
    <div class="card-image">
      <figure class="image is-16by9">
        <img :src="theme.image" v-if="theme.image">
        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" v-else>
      </figure>
      <div class="dark-mask" @click="$router.push(`/${urlUserName}/${theme.id}`)">
        <div class="title is-5">{{ theme.title }}</div>

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

      <div class="content theme-actions">
        <div class="favorite-action theme-action">
          <span class="icon">
            <i class="favorite material-icons" v-if="theme.favorite">star</i>
            <i class="material-icons" v-else>star_border</i>
          </span>
          <span class="favorite-count">{{ theme.favoriteCount }}</span>
        </div>
      </div>
    </div>

    <footer class="card-footer" v-if="isMyPage">
      <a class="edit-button card-footer-item" @click="$emit('open-edit-modal')">Edit</a>
    </footer>
  </div>
</template>

<script>
  export default {
    props: ['theme'],
    computed: {
      urlUserName() {
        return this.$route.params.userName
      },
      isMyPage() {
        return this.$store.state.user.name === this.urlUserName
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
        padding: .75rem;
        transition: all .3s ease;

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
        .subtitle {
          color: white;
          margin: .3rem 0 0;
        }
        .tags-field {
          margin-top: .5rem;
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
