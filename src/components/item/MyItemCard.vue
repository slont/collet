<template>
  <div class="my-item-card card">
    <div class="card-image trim" @click="$router.push(`/mypage/${theme.id}/${item.id}`)">
      <figure class="image is-4by3">
        <img :src="item.image || 'https://bulma.io/images/placeholders/1280x960.png'" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <router-link :to="`/mypage/${theme.id}/${item.id}`" class="title is-4">{{ item.name }}</router-link>
        </div>
      </div>
      <div class="content">{{ item.description }}</div>
    </div>
    <footer class="card-footer">
      <a class="edit-button card-footer-item" @click="$emit('open-edit-modal')">Edit</a>
      <a class="delete-button card-footer-item">Delete</a>
    </footer>
  </div>
</template>

<script>
  export default {
    props: ['theme', 'item']
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .my-item-card {
    width: 100%;

    .card-image {
      cursor: pointer;

      .image {
        img {
          height: auto;
        }
      }
    }
    .card-footer {
      .delete-button {
        color: $danger;
      }
    }
  }
</style>
