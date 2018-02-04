<template>
  <div class="item-card card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <span class="title is-6">{{ item.name }}</span>
        </div>
      </div>
      <div class="content">
        <element-view :element="item.elements[0]" v-if="item.elements[0]"></element-view>
        <div v-else>まだコンテンツがありません</div>
      </div>

      <a class="edit-button button is-info is-outlined" v-if="isMyPage"
         @click.stop="$emit('open-edit-modal')">
        <span class="icon"><i class="material-icons">edit</i></span>
        <span>編集</span>
      </a>
    </div>
  </div>
</template>

<script>
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { ElementView },
    props: ['theme', 'item'],
    computed: {
      urlUserId() {
        return this.$route.params.userId
      },
      isMyPage() {
        return this.$store.state.user.id === this.urlUserId
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .item-card {
    width: 100%;
    cursor: pointer;

    &.card .media:not(:last-child) {
      margin-bottom: .5rem;
    }
    .card-content {
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
        font-size: $size-small;
        background-color: rgba(255, 255, 255, .8);
        overflow: hidden;

        &:not(:last-child) {
          margin-bottom: 0;
        }
        .cl-element {
          .view-label {
            font-size: 1em;
            line-height: 1.5;
            color: darkgrey;
          }
          figure {
            display: flex;
            align-items: center;
            height: 18em;
            margin: 0 0 -1em 0;
            overflow: hidden;

            img {
              width: 100%;
            }
          }
        }
      }
      .edit-button {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-width: 3px;
        border-radius: 0;
        opacity: 0;

        &.is-primary.is-outlined {
          background-color: white;
        }
        .icon i {
          font-size: $size-5;
        }
      }
      &:hover .edit-button {
        opacity: 1;

        &:not(:hover) {
          color: #409eff;
          background: #ecf5ff;
        }
        &:hover.is-primary.is-outlined {
          background-color: $primary;
        }
      }
    }
  }
</style>
