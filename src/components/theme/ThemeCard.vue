<template>
  <div class="theme-card card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img :src="theme.image" v-if="theme.image">
        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" v-else>
      </figure>
      <div class="dark-mask" @click="$router.push(`/mypage/${theme.id}`)">
        <div class="title is-5">{{ theme.title }}</div>
      </div>
    </div>

    <div class="card-content">
      <div class="media">
        <div class="media-content">
          {{ theme.description }}
        </div>
      </div>

      <div class="content">
        <div class="favorite-indicator">
          <span class="icon"><i class="material-icons">favorite_border</i></span>
          <span class="favorite-count">1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['theme']
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .my-theme-card {
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
        height: 46px;
        width: 100%;
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: white;
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
    .open-edit-modal-button {
      position: absolute;
      right: .5rem;
      bottom: -1rem;
      width: 2.75rem;
      height: 2.75rem;
      padding: 0;
      border-color: rgba(32, 156, 238, .3);
    }
    .content {
      display: inline-flex;

      .favorite-indicator {
        display: inline-flex;
        align-items: center;
      }
    }
  }
</style>
