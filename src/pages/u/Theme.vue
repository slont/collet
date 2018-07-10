<template>
  <div id="userpage-theme">
    <div class="theme-header">
      <theme-card :theme="theme" @open-edit-modal="$refs.themeEditModal.open(theme)"/>
      <p class="description">{{ theme.description }}</p>
    </div>

    <div class="theme-items">
      <div class="label is-size-5 has-text-white has-text-centered">
        <span>カレット一覧</span>
      </div>
      <transition-group tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
        <div v-for="(key) in Object.keys(itemsColumns)" class="column is-12-mobile is-6-tablet" :key="`column-${key}`">
          <div v-for="item in itemsColumns[key]" class="item-list" :key="item.id" v-if="itemsColumns[key].length">
            <router-link :to="`/u/${urlUserId}/${theme.id}/${item.id}`"
                         tag="div" class="cullet-card card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <router-link class="theme-title subtitle text-color-weak is-size-7 clickable" tag="div"
                                 :to="`/u/${urlUserId}/${theme.id}`">
                      {{ theme.title }}
                    </router-link>
                    <div class="item-title text-color-strong is-size-5 has-text-weight-bold clickable">
                      {{ item.name }}
                    </div>
                    <div class="updated-at text-color-weak is-size-8">
                      <span class="icon"><i class="far fa-clock"></i></span>
                      <span>{{ fromNow(item.updatedAt, 'YYYY/MM/DD') }}</span>
                    </div>
                  </div>
                </div>

                <div class="content" v-if="item.elements.length">
                  <template v-if="2 <= item.elements.length && 'image' === item.elements[0].type && 'image' === item.elements[1].type">
                    <div class="images-divided-2 flexbox">
                      <div class="image-left trim">
                        <img :src="item.elements[0].valueStr" :srcset="`${item.elements[0].valueStr}_640w 640w`"/>
                      </div>
                      <div class="image-right trim">
                        <img :src="item.elements[1].valueStr" :srcset="`${item.elements[1].valueStr}_640w 640w`"/>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <element-view :element="item.elements[0]"/>
                    <element-view :element="item.elements[1]" v-if="item.elements[1]"/>
                  </template>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </transition-group>
    </div>

    <a @click="$refs.itemCreateModal.open(theme)" v-if="loggedIn"
       class="button button-create is-float is-info circle is-hidden-mobile">
      <i class="material-icons">add</i>
    </a>

    <theme-edit-modal ref="themeEditModal" @refresh="refresh"/>
    <item-create-modal ref="itemCreateModal" @refresh="refresh"/>
    <item-edit-modal ref="itemEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ItemModel from '@/models/Item'
  import ElementView from '@/components/element/ElementView'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ItemCard from '@/components/item/ItemCard'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
  import ItemEditModal from '@/components/item/ItemEditModal'
  import ItemPage from './Item'

  export default {
    components: { ElementView, ThemeCard, ThemeEditModal, ItemCreateModal, ItemEditModal, ItemCard, ItemPage },
    data() {
      return {
        theme: {
          title: '',
          items: [],
          tags: [],
          favorite: false,
          createdUser: {
            id: '',
            name: '',
            image: ''
          }
        },
        currentItem: {
          id: ''
        },
        openedThemeDescription: false
      }
    },
    computed: {
      selfUser: ({$store}) => $store.state.user,
      urlUserId: ({$route}) => $route.params.userId,
      itemId: ({$route}) => $route.params.itemId,
      isMyPage: ({$store, urlUserId}) => $store.state.user.id === urlUserId,
      themeId: ({$route}) => $route.params.themeId,
      itemsColumns: ({isMobile, theme}) => {
        if (isMobile) {
          return {
            0: theme.items,
            1: []
          }
        } else {
          return {
            0: theme.items.filter((item, i) => 0 === i % 2),
            1: theme.items.filter((item, i) => 1 === i % 2)
          }
        }
      }
    },
    watch: {
      itemId() {
        this.refreshItem(this.itemId)
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        const itemId = this.itemId
        const themeModel = new ThemeModel()
        themeModel.findOne(this.themeId).then(async res1 => {
          Object.assign(this.theme, res1.data)

          if (itemId) {
            await this.refreshItem(itemId)
          } else if (this.theme.items.length) {
            this.currentItem = this.theme.items[0]
          }
          if (this.loggedIn) {
            const res2 = await themeModel.findOneFavorite(this.theme.id, this.selfUser.id).catch(() => ({}))
            this.theme.favorite = res2.data && !!res2.data.themeId
          }
        }).catch(() => {
          this.$router.replace(`/u/${this.urlUserId}`)
        })
      },
      async refreshItem(itemId) {
        await new ItemModel(this.theme.id).findOne(itemId).then(res => {
          this.currentItem = res.data
          this.$nextTick(() => {
            window.scrollTo(0, 0)
          })
        })
      },
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
          return new ThemeModel().deleteFavorite(this.theme.id, this.selfUser.id)
        } else {
          return new ThemeModel().updateFavorite(this.theme.id, this.selfUser.id)
        }
      },
      infiniteScroll(event) {
        if (event.target.scrollHeight <= event.target.scrollTop + event.target.offsetHeight) {
          this.$refs.child.fetch()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-theme {
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;

    &.container {
      height: calc(100vh - #{$header-nav-height});
    }
    .theme-header {
      max-width: $width;
      margin: 0 auto;
      background-color: white;

      .theme-card {
        max-width: 100%;
        border-radius: 0;

        .dark-mask,
        .image {
          border-radius: 0;
        }
      }
      .description {
        padding: .75rem;
      }
    }
    .theme-items {
      max-width: $width;
      margin: 0 auto;

      > .label {
        @include label-accent-sp;
      }
      > .columns {
        margin-top: 0;
      }
      .item-list {
        padding: 0;
        margin: 0 0 .75rem;

        .card-content {
          .media {
            margin-bottom: .25em;

            .media-content {
              > :not(:last-child) {
                margin-bottom: .3em;
              }
              .theme-title {
                height: 1rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap
              }
              .item-title {
                display: flex;
                max-height: 2.5em;
                overflow: hidden;
              }
            }
            .media-right {
              .image {
                height: 54px;
                overflow: hidden;

                img {
                  height: 100%;
                  width: auto;
                }
              }
            }
            + .content {
              margin-top: 1.5em;
            }
          } // .media
          .content {
            > :not(:last-child) {
              margin-bottom: 1.5em;
            }
            .view-label {
              font-size: $size-7;
              color: $text-color-weak;
            }
            .element-view {
              .text-element {
                .control {
                  max-height: 164px;
                  overflow: hidden;

                  .value {
                    font-size: $size-6;
                  }
                }
              }
              .image-element {
                .file-view {
                  display: flex;
                  align-items: center;
                  max-height: 20em;
                  margin: 0;
                  overflow: hidden;
                }
              }
            }
          }
        } // .card-content
      } // .item-list
    }
    .fixed-action-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;

      &.vertical ul {
        position: absolute;
        display: inline-flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: flex-start;
        bottom: 0;
        height: 500px;
        width: 100%;
        padding-bottom: 64px;
        visibility: hidden;

        li {
          .button {
            height: 40px;
            width: 40px;
            margin: .5rem;
          }
        }
        &:hover {
          visibility: visible;
        }
      }
      .trigger-button {
        z-index: 100;

        .material-icons {
          transition: all .3s;
        }
      }
      &:hover {
        .trigger-button {
          .material-icons {
            transform: rotate(-135deg);
          }
          + ul {
            visibility: visible;
          }
        }
      }
    }
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }

    @media screen and (min-width: 769px) {
      .theme-card .theme-image {
        height: 14rem;
      }
    }

    @media screen and (max-width: 768px) {
      &.container {
        height: calc(100vh - #{$header-nav-height + $footer-nav-height});
      }
      .theme-content {
        width: 100%;
        margin: 0;

        .theme-columns {
          > .main-column {
            padding: 1.5rem 1rem;
          }
          .hidden-mobile-only {
            display: none;
          }
        }
      }
      .theme-items {
        > .columns {
          margin: .25rem;

          .column {
            padding: 0;
          }
        }
      }
    }
  }
</style>
