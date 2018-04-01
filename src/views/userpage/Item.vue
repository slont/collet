<template>
  <div id="userpage-item">
    <div class="scrollable-container" @scroll="onScrollContainer">
      <router-link :to="`/u/${$route.params.userId}/${themeId}`" tag="div"
                   class="theme-title is-size-7 text-color-weak">
        {{ theme.title }}
      </router-link>

      <div class="cullet-container">
        <transition :name="transition">
          <div v-for="item in items" class="cullet-content" v-if="currentItem.id === item.id" :key="item.id">
            <div class="item-info">
              <div class="title is-3">
                {{ item.name }}
                <a class="edit-button button is-info is-outlined is-hidden-mobile"
                   @click="$refs.itemEditModal.open(theme, item)" v-if="isMyPage">
                  <span class="icon"><i class="material-icons">edit</i></span>
                  <span>編集</span>
                </a>
                <a class="edit-button button is-info is-outlined is-hidden-tablet"
                   @click="$router.push(`/m/editItem/${theme.id}/${item.id}`)" v-if="isMyPage">
                  <span class="icon"><i class="material-icons">edit</i></span>
                  <span>編集</span>
                </a>
              </div>
            </div>

            <div class="item-elements">
              <div v-for="(element, i) in currentItem.elements" :key="i" class="field element-field">
                <element-view :element="element"/>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="cullet-pagination flexbox fullwidth has-text-white" :class="{ 'is-active': activePagination }">
      <div @click="next" class="next cullet-pagination-item flexbox" v-if="currentItem.next.id">
        <span class="icon is-size-3"><i class="fa fas fa-chevron-left"></i></span>
        <div class="cullet-name is-size-5">{{ currentItem.next.name }}</div>
      </div>
      <div @click="prev" class="prev cullet-pagination-item flexbox is-justify-end has-text-right" v-if="currentItem.prev.id">
        <div class="cullet-name is-size-5 is-justify-end has-text-left">{{ currentItem.prev.name }}</div>
        <span class="icon is-size-3"><i class="fa fas fa-chevron-right"></i></span>
      </div>
    </div>

    <item-edit-modal ref="itemEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ItemModel from '@/models/Item'
  import ItemEditModal from '@/components/item/ItemEditModal'
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { ItemEditModal, ElementView },
    data() {
      return {
        theme: {
          id: '',
          title: ''
        },
        currentItem: {
          id: '',
          name: '',
          elements: [],
          prev: {
            id: '',
            name: ''
          },
          next: {
            id: '',
            name: ''
          }
        },
        items: [],
        currentIndex: 0,
        transition: 'slide-fade',
        scrolledTop: 0,
        activePagination: false
      }
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      },
      isMyPage() {
        return this.$store.state.user.id === this.urlUserId
      },
      themeId() {
        return this.$route.params.themeId
      },
      itemId() {
        return this.currentItem.id || this.$route.params.itemId
      },
      innerHeight() {
        return this.$el.querySelector('.scrollable-container').scrollHeight - this.$el.querySelector('.scrollable-container').clientHeight
      }
    },
    mounted() {
      this.init()
    },
    async beforeRouteUpdate(to, from, next) {
      if (this.itemId !== to.params.itemId) {
        await this.refresh({
          id: to.params.itemId
        })
      }
      next()
    },
    methods: {
      async init() {
        new ItemModel(this.themeId).findOne(this.itemId).then(res => {
          Object.assign(this.currentItem, res.data)
          if (res.data.next.id) {
            this.items.push(res.data.next)
          }
          this.items.push(res.data)
          if (res.data.prev.id) {
            this.items.push(res.data.prev)
          }

          this.$nextTick(() => {
            if (80 > this.$el.querySelector('.scrollable-container').scrollHeight - this.$el.querySelector('.scrollable-container').clientHeight) {
              this.activePagination = true
            }
          })
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
        new ThemeModel().findOne(this.themeId).then(res => {
          Object.assign(this.theme, res.data)
        })
      },
      async refresh(item, transition = 'slide-fade') {
        this.transition = transition
        await new ItemModel(this.themeId).findOne(item.id).then(res => {
          Object.assign(this.currentItem, res.data)
          const first = this.items[0]
          if (first.id === res.data.id) {
            this.items.unshift(res.data.next)
          }
          const last = this.items[this.items.length - 1]
          if (last.id === res.data.id) {
            this.items.push(res.data.prev)
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      async next() {
        const itemId = this.currentItem.next.id
        await this.refresh(this.currentItem.next, 'show-next')
        this.$router.push(`/u/${this.urlUserId}/${this.themeId}/${itemId}`)
      },
      async prev() {
        const itemId = this.currentItem.prev.id
        await this.refresh(this.currentItem.prev, 'show-prev')
        this.$router.push(`/u/${this.urlUserId}/${this.themeId}/${itemId}`)
      },
      onScrollContainer() {
        const scrollTop = this.$el.querySelector('.scrollable-container').scrollTop
        if (80 > this.innerHeight - scrollTop) {
          this.activePagination = true
        } else {
          this.activePagination = scrollTop < this.scrolledTop
        }
        this.scrolledTop = scrollTop
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-item {
    padding: 1em;

    .scrollable-container {
      overflow-y: scroll;
    }
    .theme-title {
      margin-bottom: .5rem;
      text-decoration: underline;
    }
    .edit-button {
      margin-bottom: .5rem;

      .icon i {
        font-size: $size-5;
      }
    }
    .cullet-container {
      position: relative;
      min-height: 72vh;

      .cullet-content {
        position: absolute;
        width: 100%;
        margin-bottom: 100px;

        .item-info {
          margin-bottom: 2rem;

          .title {
            border-bottom: $border-style;
          }
          .subtitle {
            line-height: inherit;
          }
          .image {
            img {
              width: 70%;
              margin: auto;
            }
          }
        }
        .item-elements {
          .element-field:not(:last-child) {
            margin-bottom: 2em;
          }
        }
      }
    }
    .cullet-pagination {
      position: fixed;
      left: 0;
      bottom: -$footer-nav-height * 3;
      height: 4.5em;
      z-index: 1;
      transition: bottom .4s;

      &.is-active {
        bottom: $footer-nav-height;
      }
      &-item {
        width: 46%;
        height: 4.5em;
        background-color: rgba($link, .6);

        .cullet-name {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          padding: 0 1em;
          overflow: hidden;
          line-height: 1.25;
        }
        &.next {
          padding-left: 1em;
          border-top-right-radius: $size-1;
          border-bottom-right-radius: $size-1;
        }
        &.prev {
          padding-right: 1em;
          border-top-left-radius: $size-1;
          border-bottom-left-radius: $size-1;
        }
      }
    }

    .show-next-enter-active, .show-next-leave-active,
    .show-prev-enter-active, .show-prev-leave-active  {
      transition: all .4s;
    }
    .show-next-enter, .show-prev-leave-to {
      transform: translateX(-100%);
    }
    .show-next-leave-to, .show-prev-enter {
      transform: translateX(100%);
    }
  }
</style>
