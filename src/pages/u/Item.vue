<template>
  <div id="userpage-item" @scroll="onScrollContainer">
    <div class="container">
      <div class="media">
        <div class="media-left" v-if="theme.createdUser.image">
          <figure class="image circle flexbox">
            <user-image :src="theme.createdUser.image"/>
          </figure>
        </div>
        <div class="media-content">
          <div class="flexbox">
            <router-link :to="`/u/${theme.createdUser.id}`" class="is-size-7 text-color-weak">
              <span class="has-text-weight-bold clickable">{{ theme.createdUser.name }}</span>
              <span>@{{ theme.createdUser.id }}</span>
            </router-link>
            <span class="theme-actions">
            <span class="favorite-action action">
              <span class="icon"><i class="fa-heart fa-pull-left" :class="[theme.favorite ? 'fas' : 'far']"></i></span>
              <span class="favorite-count count has-text-weight-bold" v-if="theme.favoriteCount">{{ theme.favoriteCount }}</span>
            </span>
            <span class="item-action action">
              <span class="icon"><i class="fas fa-list-ul fa-pull-left"></i></span>
              <span class="item-count count has-text-weight-bold">{{ theme.itemCount }}</span>
            </span>
          </span>
          </div>
          <router-link :to="`/u/${$route.params.userId}/${themeId}`" tag="div"
                       class="theme-title is-size text-color-weak has-text-weight-bold clickable">
            {{ theme.title }}
          </router-link>
        </div>
        <router-link :to="`/u/${$route.params.userId}/${themeId}`" class="media-right clickable" tag="div" v-if="theme.image">
          <figure class="image"><img :src="theme.image" :srcset="`${theme.image}_640w 640w`"></figure>
        </router-link>
      </div><!-- .media -->

      <div class="cullet-container">
        <transition :name="transition">
          <div v-for="item in items" class="cullet-content" v-if="currentItem.id === item.id" :key="item.id">
            <div class="cullet-info">
              <div class="updated-at text-color-weak is-size-8" v-if="item.updatedAt">
                <span>{{ fromNow(item.createdAt, 'YYYY/MM/DD HH:mm') }}</span>
                <span v-if="1 < $moment(item.updatedAt).diff($moment(item.createdAt), 'hours')">
                  ({{ item.updatedAt | moment('MM/DD HH:mm') }} 更新)
                </span>
              </div>
              <div class="title is-3 flexbox">
                {{ item.name }}

                <template v-if="loggedIn && isMyPage">
                  <a class="edit-button button is-info is-outlined is-size-7" v-if="isMobile"
                     @click="$router.push(`/m/editItem/${theme.id}/${item.id}`)">
                    <span class="icon"><i class="material-icons">edit</i></span>
                    <span>編集</span>
                  </a>
                  <a class="edit-button button is-info is-outlined" v-else
                     @click="$refs.itemEditModal.open(theme, item)">
                    <span class="icon"><i class="material-icons">edit</i></span>
                    <span>編集</span>
                  </a>
                </template>
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

    <div class="social-sharing" :class="{ 'is-active': activePagination }">
      <social-sharing :url="href" :title="`${currentItem.name} | Cullet (カレット)`" inline-template>
        <div>
          <!--<network network="facebook">
            <span class="facebook-icon icon circle is-size-1">
              <i class="fab fa-facebook-f fa-fw is-size-4"></i>
            </span>
          </network>-->
          <network network="twitter">
            <span class="twitter-icon is-48x48 icon circle">
              <i class="fab fa-twitter fa-fw is-size-3"></i>
            </span>
          </network>
        </div>
      </social-sharing>
    </div>

    <div class="cullet-pagination flexbox fullwidth has-text-white" :class="{ 'is-active': activePagination }">
      <div @click="next" class="next cullet-pagination-item flexbox" v-if="currentItem.next.id">
        <span class="icon"><i class="fa fas fa-chevron-left"></i></span>
        <div class="cullet-name">{{ currentItem.next.name }}</div>
      </div>
      <div @click="prev" class="prev cullet-pagination-item flexbox is-justify-end has-text-right" v-if="currentItem.prev.id">
        <div class="cullet-name is-justify-end">{{ currentItem.prev.name }}</div>
        <span class="icon"><i class="fa fas fa-chevron-right"></i></span>
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
        return this.$el.scrollHeight - this.$el.clientHeight
      },
      href() {
        return location.href
      },
      ogTitle() {
        return this.currentItem.name ? `${this.currentItem.name} - ${this.theme.title}` : ''
      },
      ogDescription() {
        const el = this.currentItem.elements.find(e => 'text' === e.type)
        return el ? el.valueStr : ''
      },
      ogImage() {
        const el = this.currentItem.elements.find(e => 'image' === e.type)
        return el ? el.valueStr : ''
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

          if (this.ogDescription) {
            this.$store.commit('SET_OG_DESCRIPTION', this.ogDescription)
          }
          if (this.ogImage) {
            this.$store.commit('SET_OG_IMAGE', this.ogImage)
          }
          this.$emit('updateHead')
          this.$nextTick(() => {
            if (80 > this.$el.scrollHeight - this.$el.clientHeight) {
              this.activePagination = true
            }
          })
        }).catch(err => {
          console.log(err)
          this.$toast.open({
            message: 'データ取得に失敗しました',
            type: 'is-danger'
          })
        })
        new ThemeModel().findOne(this.themeId).then(res => {
          Object.assign(this.theme, res.data)
          this.$store.commit('SET_OG_TITLE', this.ogTitle)
          this.$emit('updateHead')
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
          this.$toast.open({
            message: 'データ取得に失敗しました',
            type: 'is-danger'
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
        const scrollTop = this.$el.scrollTop
        if (80 > this.innerHeight - scrollTop) {
          this.activePagination = true
        } else {
          this.activePagination = scrollTop < this.scrolledTop
        }
        this.scrolledTop = scrollTop
      },
      scrollToTop(scrollDuration) {
        const scrollHeight = this.$el.scrollTop
        const scrollStep = Math.PI / (scrollDuration / 15)
        const cosParameter = scrollHeight / 2
        let scrollCount = 0
        let scrollMargin
        let scrollInterval = setInterval(() => {
          if (0 !== this.$el.scrollTop) {
            scrollCount = scrollCount + 1
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep)
            this.$el.scrollTop = scrollHeight - scrollMargin
          } else clearInterval(scrollInterval)
        }, 15)
      }
    },
    head: {
      meta() {
        return [
          { property: 'og:title', content: this.$store.state.ogTitle },
          { property: 'og:description', content: this.$store.state.ogDescription },
          { property: 'og:url', content: `https://www.cullet.me${this.$route.fullPath}` },
          { property: 'og:image', content: this.$store.state.ogImage }
        ]
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-item {
    height: calc(100vh - #{$header-nav-height});
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;
    background-color: white;

    > .container {
      padding: 1rem;
      max-width: 720px;

      > .media {
        min-height: 3.5rem;

        .media-left {
          margin-right: .5rem;

          .image {
            height: 2.25rem;
            width: 2.25rem;
          }
        }
        .media-content {
          .theme-actions {
            display: inline-flex;
            align-items: center;
            margin-left: auto;

            .action {
              display: flex;
              align-items: center;
            }
            .favorite-action {
              margin-left: auto;
            }
            .item-action {
              margin-left: .5rem;
            }
          }
          .theme-title {
            margin-top: .125rem;
            max-height: 1rem;
            overflow: hidden;
          }
        }
        .media-right {
          margin-left: .5rem;

          .image {
            display: flex;
            align-items: center;
            height: 3.5rem;
            z-index: 1;

            img {
              height: 4.5rem;
              width: auto;
            }
          }
        }
      } // .media
    } // .content
    .cullet-container {
      position: relative;
      min-height: 80vh;

      .cullet-content {
        position: absolute;
        width: 100%;

        > :last-child {
          margin-bottom: 120px;
        }
        .cullet-info {
          margin-bottom: 1rem;
          border-bottom: $border-style;

          .updated-at {
            margin-top: -.75rem;
            margin-bottom: 1rem;
          }
          .title {
            line-height: 1.25;
            font-feature-settings: 'palt' 1;
            letter-spacing: .04em;

            .edit-button {
              margin-left: auto;
            }
          }
        }
        .item-elements {
          .element-field {
            &:not(:last-child) {
              margin-bottom: 2em;
            }
            .link-card {
              flex-direction: column;
              max-height: 24rem;

              .image {
                max-width: 100%;
                max-height: 16rem;
                border-radius: 5px 5px 0 0;

                img {
                  height: initial;
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }

    .social-sharing {
      position: fixed;
      right: -50px;
      bottom: $footer-nav-height * 2.5;
      z-index: 1;
      transition: right .4s;

      &.is-active {
        right: 1em;
      }
      .icon {
        $size: 48px;
        height: $size;
        width: $size;
        border-width: 2px;
        border-style: solid;
        transition: color .1s, background-color .2s;

        &:hover {
          color: white;
        }
      }
      .facebook-icon {
        $color: #3B5998;
        color: $color;
        border-color: $color;

        &:hover {
          background-color: $color;
        }
      }
      .twitter-icon {
        $color: #55acee;
        color: $color;
        border-color: $color;

        &:hover {
          background-color: $color;
        }
      }
    }
    .cullet-pagination {
      position: fixed;
      left: 0;
      bottom: -$footer-nav-height * 3;
      height: 4rem;
      z-index: 1;
      transition: bottom .35s;

      &.is-active {
        bottom: $footer-nav-height;
      }
      &-item {
        height: 4rem;
        width: 46%;
        max-width: 14em;
        padding: 0 .5em;
        background-color: rgba($link, .6);

        .cullet-name {
          font-size: $size-6;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          padding: 0 .5em;
          overflow: hidden;
          font-weight: bold;
        }
        .icon {
          font-size: $size-4;
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

    @media screen and (max-width: 768px) {
      height: calc(100vh - #{$header-nav-height + $footer-nav-height});

      .cullet-container {
        .cullet-content {
          .item-elements {
            .element-field {
              .link-card {
                .image {
                  max-height: 10rem;
                }
              }
            }
          }
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
