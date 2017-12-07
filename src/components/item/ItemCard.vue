<template>
  <div class="item-card card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <router-link :to="`/${urlUserName}/${theme.id}/${item.id}`" class="title is-6">{{ item.name }}</router-link>
        </div>
        <div class="media-right" v-if="item.image">
          <figure class="image">
            <img :src="item.image" alt="Placeholder image">
          </figure>
        </div>
      </div>
      <div class="content">{{ item.description }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['theme', 'item'],
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
  .item-card {
    width: 100%;
    cursor: pointer;

    .media {
      align-items: center;
      $size: 3rem;
      height: $size;

      .media-content {
        height: $size;
        overflow: hidden;
      }
      .media-right {
        display: flex;
        align-items: center;
        max-height: 4rem;
        width: 7rem;
        margin: auto 0 auto .5rem;
        overflow: hidden;
      }
    }
    .content {
      font-size: $size-7;
      height: 2rem;
      background-color: rgba(255, 255, 255, .8);
      overflow: hidden;
    }
  }
</style>
