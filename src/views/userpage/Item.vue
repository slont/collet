<template>
  <div id="userpage-item">
    <div class="scrollable-container" @scroll="onScrollContainer">
      <router-link :to="`/u/${$route.params.userId}/${themeId}`" tag="div"
                   class="theme-title is-size-7 has-text-underline text-color-weak">
        {{ theme.title }}
      </router-link>
      <div class="theme-tags tags is-size-8" v-if="theme.tags.length">
        <el-tag v-for="tag in theme.tags" :key="tag.tagId" type="warning"
                @click.native="$router.push(`/tag?name=${tag.name}`)">
          #{{ tag.name }}
        </el-tag>
      </div>
      <div class="user-profile flexbox has-align-centered is-size-7">
        <figure class="image circle is-16x16 flexbox" v-if="theme.createdUser.image">
          <img :src="theme.createdUser.image" :srcset="`${theme.createdUser.image}_640w 640w`">
        </figure>
        <div @click.stop="$router.push(`/u/${theme.createdUser.id}`)">
          <span class="user-name">{{ theme.createdUser.name }}
          </span><span class="user-id text-color-weak">@{{ theme.createdUser.id }}</span>
        </div>
      </div>

      <div class="cullet-container">
        <transition :name="transition">
          <div v-for="item in items" class="cullet-content" v-if="currentItem.id === item.id" :key="item.id">
            <div class="cullet-info">
              <div class="updated-at text-color-weak is-size-7 has-text-right" v-if="item.updatedAt">
                <span class="icon"><i class="material-icons">access_time</i></span>
                {{ item.createdAt | fromNow('YYYY/MM/DD HH:mm') }}
                <span class="is-size-8" v-if="1 < item.updatedAt.diff(item.createdAt, 'hours')">
                  ({{ item.updatedAt.format('YYYY/MM/DD HH:mm') }} 更新)
                </span>
              </div>
              <div class="title is-3">
                {{ item.name }}

                <a class="edit-button button is-info is-outlined is-size-7 is-hidden-tablet"
                   @click="$router.push(`/m/editItem/${theme.id}/${item.id}`)" v-if="loggedIn && isMyPage">
                  <span class="icon"><i class="material-icons">edit</i></span>
                  <span>編集</span>
                </a>
              </div>

              <a class="edit-button button is-info is-outlined is-hidden-mobile"
                 @click="$refs.itemEditModal.open(theme, item)" v-if="loggedIn && isMyPage">
                <span class="icon"><i class="material-icons">edit</i></span>
                <span>編集</span>
              </a>
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
        <div class="cullet-name is-size-6">{{ currentItem.next.name }}</div>
      </div>
      <div @click="prev" class="prev cullet-pagination-item flexbox is-justify-end has-text-right" v-if="currentItem.prev.id">
        <div class="cullet-name is-size-6 is-justify-end has-text-left">{{ currentItem.prev.name }}</div>
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
          title: '',
          tags: [],
          createdUser: {
            id: '',
            name: '',
            image: ''
          }
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
          setTimeout(() => this.scrollToTop(300), 400)
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
      },
      scrollToTop(scrollDuration) {
        const scrollHeight = this.$el.querySelector('.scrollable-container').scrollTop
        const scrollStep = Math.PI / (scrollDuration / 15)
        const cosParameter = scrollHeight / 2
        let scrollCount = 0
        let scrollMargin
        let scrollInterval = setInterval(() => {
          if (0 !== this.$el.querySelector('.scrollable-container').scrollTop) {
            scrollCount = scrollCount + 1
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep)
            this.$el.querySelector('.scrollable-container').scrollTop = scrollHeight - scrollMargin
          } else clearInterval(scrollInterval)
        }, 15)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-item {
    .scrollable-container {
      overflow-y: scroll;
      margin: 1em auto;
      width: 90%;

      .theme-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
    .theme-tags {
      margin-top: .5em;
      margin-bottom: 0;
    }
    .user-profile {
      margin-top: .5em;

      .image {
        margin-right: .5em;
      }
    }
    .cullet-container {
      position: relative;
      min-height: 80vh;

      .cullet-content {
        position: absolute;
        width: 100%;

        > :last-child {
          margin-bottom: 100px;
        }
        .cullet-info {
          margin-bottom: 2rem;
          border-bottom: $border-style;

          .title {
            margin-bottom: .25em;
          }
          .subtitle {
            line-height: inherit;
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
        height: 4.5em;
        width: 46%;
        max-width: 14em;
        padding: 0 .5em;
        background-color: rgba($link, .6);

        .cullet-name {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          padding: 0 .5em;
          overflow: hidden;
          line-height: 1.25;
        }
        &.next {
          border-top-right-radius: $size-1;
          border-bottom-right-radius: $size-1;
        }
        &.prev {
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
