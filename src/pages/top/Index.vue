<template>
  <div id="top-index" @scroll.passive="infiniteScroll">
    <div class="container">
      <div class="temp-cullet" v-if="tempItem.createdAt">
        <router-link :to="`/u/${user.id}`" tag="label" class="temp-cullet-label label is-size-5 has-text-white has-text-centered">
          メモカレット
        </router-link>
        <div class="updated-cullet flexbox column is-12 card">
          <div class="updated-at text-color-weak has-text-right">
            <div class="flexbox">
              <div class="updated-at-date is-size-7">{{ tempItem.updatedAt | moment('M/D') }}</div>
              <div class="is-size-8">{{ tempItem.updatedAt | moment('ddd') }}</div>
            </div>
          </div>

          <div class="media">
            <div class="media-content">
              <router-link to="tempItem" class="item-title subtitle text-color-strong is-size-5 has-text-weight-bold">
                {{ tempItem.name }}
              </router-link>

              <div class="content" v-if="tempItem.elements.length">
                <element-view :element="tempItem.elements[0]"/>
              </div>
            </div>
          </div>
        </div>
      </div><!-- .temp-cullet -->
      <div class="updated-cullet-list" v-if="loggedIn && user.id && updatedItems.length">
        <router-link :to="`/u/${user.id}`" tag="label" class="updated-cullet-label label is-size-5 has-text-white has-text-centered">
          Myカレット履歴
        </router-link>
        <transition-group tag="div" name="slide-fade" mode="out-in" class="updated-cullet-list-card card item-list columns is-multiline is-gapless-only">
          <div v-for="(item, i) in updatedItems" class="updated-cullet flexbox column is-4-tablet is-12-mobile" :key="item.id">
            <div class="updated-at text-color-weak has-text-right">
              <div class="flexbox" :class="{'is-hidden-mobile': !visibleUpdatedAt(item.updatedAt, i)}">
                <div class="updated-at-date is-size-7">{{ item.updatedAt | moment('M/D') }}</div>
                <div class="is-size-8">{{ item.updatedAt | moment('ddd') }}</div>
              </div>
            </div>

            <div class="media">
              <div class="media-content">
                <router-link class="theme-title subtitle text-color-weak is-size-7" tag="div"
                             :to="`/u/${user.id}/${item.theme.id}`">
                  {{ item.theme.title }}
                  <span class="icon" v-if="item.theme.private"><i class="fas fa-lock fa-fw"></i></span>
                </router-link>
                <router-link class="item-title text-color-strong is-size-6 has-text-weight-bold" tag="div"
                             :to="`/u/${user.id}/${item.theme.id}/${item.id}`">
                  {{ item.name }}
                </router-link>
              </div>

              <div class="media-right" v-if="item.elements[0] && 'image' === item.elements[0].type && item.elements[0].valueStr">
                <figure class="image"><img :src="item.elements[0].valueStr" :srcset="`${item.elements[0].valueStr}_640w 640w`"></figure>
              </div>
              <div class="media-right" v-else-if="item.elements[1] && 'image' === item.elements[1].type && item.elements[1].valueStr">
                <figure class="image"><img :src="item.elements[1].valueStr" :srcset="`${item.elements[1].valueStr}_640w 640w`"></figure>
              </div>
            </div>
          </div>
          <div class="updated-cullet-link updated-cullet flexbox column is-4-tablet" key="link">
            <div class="media">
              <div class="media-content">
                <router-link :to="`/u/${user.id}`" :class="{'has-justify-right': isMobile}"
                             class="item-title flexbox text-color-strong is-size-5 has-text-weight-bold clickable">
                  Myカレット一覧へ
                  <span class="icon"><i class="fas fa-angle-double-right fa-fw"></i></span>
                </router-link>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="new-cullet-list">
        <label class="new-cullet-label label is-size-5 has-text-white has-text-centered">タイムライン</label>

        <transition-group tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
          <div v-for="(key) in Object.keys(newItemsColumns)" class="column is-12-mobile is-6-tablet" :key="`column-${key}`">
            <div v-for="item in newItemsColumns[key]" class="item-list" :key="item.id" v-if="newItemsColumns[key].length">
              <router-link :to="`/u/${item.theme.createdUser.id}/${item.theme.id}/${item.id}`"
                           tag="div" class="new-cullet-card card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left" v-if="item.theme.createdUser.image">
                      <figure class="image circle flexbox">
                        <user-image :src="item.theme.createdUser.image"/>
                      </figure>
                    </div>
                    <div class="media-content">
                      <div class="is-size-7 text-color-weak">
                        <span>
                          <router-link :to="`/u/${item.theme.createdUser.id}`" class="text-color-weak">
                            <span class="has-text-weight-bold clickable">{{ item.theme.createdUser.name }}</span>
                            <span>@{{ item.theme.createdUser.id }}</span>
                          </router-link>
                        </span>
                        <span>-</span>
                        <span>
                          <span class="created-at">{{ fromNow(item.createdAt, 'MM/DD') }}</span>
                        </span>
                      </div>

                      <router-link class="theme-title subtitle text-color-weak is-size-7 has-text-weight-bold clickable is-justify-end"
                                   :to="`/u/${item.theme.createdUser.id}/${item.theme.id}`" tag="div">
                        {{ item.theme.title }}
                      </router-link>
                    </div>

                    <div class="media-right" v-if="item.theme.image">
                      <figure class="image"><img :src="item.theme.image" :srcset="`${item.theme.image}_640w 640w`"></figure>
                    </div>
                  </div>

                  <div class="item-title text-color-strong is-size-4 has-text-weight-bold clickable">
                    {{ item.name }}
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
                </div><!-- .card-content -->
              </router-link><!-- .new-cullet-card -->
            </div>
          </div>
          <div class="button is-loading fullwidth is-large" key="loading" v-if="newItems.length && newItems.length < newItemsTotal"></div>
        </transition-group>
      </div>
    </div>

    <a @click.stop="$refs.itemCreateModal.open" v-if="loggedIn"
       class="button button-create is-float is-primary circle is-hidden-mobile">
      <i class="material-icons">add</i>
    </a>

    <item-create-modal ref="itemCreateModal"/>
    <theme-edit-modal ref="themeEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ItemModel from '@/models/Item'
  import UserModel from '@/models/User'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
  import ItemCard from '@/components/item/ItemCard'
  import ElementView from '@/components/element/ElementView'
  const SIZE = 12

  export default {
    components: {ThemeCard, ItemCard, ThemeEditModal, ItemCreateModal, ElementView},
    data() {
      return {
        topThemes: [],
        updatedItems: [],
        newItems: [],
        page: 1,
        size: SIZE,
        isFetching: false,
        isLastFetch: false,
        newItemsTotal: 10000
      }
    },
    computed: {
      user: ({$store}) => $store.state.user,
      tempItem: ({$store}) => $store.state.tempItem,
      newItemsColumns() {
        if (this.isMobile) {
          return {
            0: this.newItems,
            1: []
          }
        } else {
          return {
            0: this.newItems.filter((item, i) => 0 === i % 2),
            1: this.newItems.filter((item, i) => 1 === i % 2)
          }
        }
      }
    },
    created() {
      if (this.loggedIn) {
        Object.assign(this.updatedItems, new ItemModel().deserialize(this.$store.state.items).slice(0, this.isMobile ? 3 : 5))
      }
      this.refresh()
    },
    methods: {
      refresh() {
        if (this.loggedIn) {
          new UserModel().findItems(this.user.id, {p: 1, s: 10, q: ''}).then(res => {
            this.updatedItems = res.data.slice(0, this.isMobile ? 3 : 5)
            this.$store.commit('SET_ITEMS', res.data)
          })
        }

        this.fetchNewItems()
      },
      fetchNewItems() {
        this.isFetching = true
        new ItemModel().findByNew({
          p: this.page++,
          s: this.size
        }).then(res => {
          if (!res.data.length) {
            this.isLastFetch = true
            return
          }

          if (0 === Math.floor(this.newItems.length / this.size)) {
            this.newItems = res.data
          } else {
            this.newItems.push(...res.data)
          }
          this.newItemsTotal = res.headers.get('X-Page-Total')
          this.isFetching = false
        })
      },
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      },
      visibleUpdatedAt(updatedAt, index) {
        const _updatedAt = this.$moment(updatedAt)
        if (index === this.updatedItems.length - 1) {
          return true
        } else if (24 > this.$moment().diff(_updatedAt, 'hours')) {
          return true
        }
        return 0 !== this.$moment(this.updatedItems[index + 1].updatedAt).diff(_updatedAt, 'days')
      },
      infiniteScroll(event) {
        if (this.isLastFetch || this.isFetching) return

        if (this.$el.scrollHeight <= event.target.scrollTop + event.target.offsetHeight) {
          this.fetchNewItems()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #top-index {
    height: calc(100vh - #{$header-nav-height});
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;

    > .container {
      max-width: $width;
    }
    [class*="-cullet-label"] {
      @include label-accent-sp;
    }
    [class$="-cullet-list"] {
      &:not(:first-child) {
        margin-top: 3px;
      }
    }
    .updated-cullet {
      .updated-at {
        min-width: 54px;

        .flexbox {
          flex-direction: column;
          justify-content: center;
          height: 40px;
          width: 40px;
          color: $info;
          font-weight: bold;
          border-radius: 50%;
          border: 2px solid $info;

          .is-size-8 {
            line-height: 1;
          }
        }
      }
      .media-right {
        .image {
          height: 3rem;
          overflow: hidden;

          img {
            height: 100%;
            width: auto;
          }
        }
      }
      .theme-title,
      .item-title {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
      &.updated-cullet-link {
        justify-content: center;

        .item-title {
          .icon {
            margin-left: .5rem;
          }
        }
      }
    }
    .temp-cullet {
      .media {
        flex: 1;

        .content {
          margin-top: .5rem;

          > :not(:last-child) {
            margin-bottom: 1.5em;
          }
          .view-label {
            font-size: $size-7;
            color: $text-color-weak;
          }
        }
      }
    }
    .new-cullet-label {
      &:before{
        transform: rotate(30deg);
        left: -90px;
      }
      &:after{
        transform: rotate(30deg);
        left: 113px;
      }
    }
    .new-cullet-list {
      .item-list {
        .new-cullet-card {
          &:hover {
            cursor: pointer;
          }
          .media {
            margin-bottom: .25em;

            .media-left {
              margin-right: .5rem;

              .image {
                height: 2rem;
                width: 2rem;
              }
            }
            .media-content {
              > :not(:last-child) {
                margin-bottom: .25rem;
              }
            }
            .media-right {
              margin-left: .5rem;

              .image {
                display: flex;
                align-items: center;
                height: 2.25rem;

                img {
                  height: 3rem;
                  width: auto;
                }
              }
            }
            + .content {
              margin-top: 1rem;
            }
          }
          .user-profile {
            .image {
              margin-right: .35em;
            }
          }
          .theme-title {
            height: 1.125em;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item-title {
            display: flex;
            margin: .75rem 0;
            max-height: 2.5em;
            line-height: 1.2;
            font-feature-settings: 'palt' 1;
            letter-spacing: .04em;
            overflow: hidden;
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
                max-height: 24em;
                margin: 0;
                overflow: hidden;
              }
            }
          }
          .content {
            > :not(:last-child) {
              margin-bottom: 1.5em;
            }
            .view-label {
              font-size: $size-7;
              color: $text-color-weak;
            }
          }
        }
      }
    }
    .meta-data {
      display: inline-flex;
      font-size: $size-small;
      margin-left: auto;

      > figure,
      > div:not(:last-child) {
        margin-right: 3px;
      }
    }

    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }

    @media screen and (min-width: 769px) {
      .new-cullet-list {
        > .columns {
          padding: 0 1px;
        }
        .item-list {
          &:not(:last-child) {
            margin-bottom: 1.5rem;
          }
        }
      }
    }

    @media screen and (max-width: 768px) {
      height: calc(100vh - #{$header-nav-height + $footer-nav-height});

      .temp-cullet {
        .updated-cullet {
          margin: 0 .25rem;
        }
      }
      .updated-cullet-list {
        margin: 0;

        .updated-cullet-list-card {
          margin: 0 .25rem;
          z-index: 1;
        }
        .item-list {
          padding: 0;

          .updated-cullet {
            align-items: flex-end;

            &:not(:last-child) {
              padding-bottom: 0;
            }
            &:last-child {
              .media {
                border-bottom: none;
              }
            }
            .media {
              flex: 1;
              border-bottom: $border-style;

              .media-content {
                > :not(:last-child) {
                  margin-bottom: .3em;
                }
                .theme-title {
                  height: 15px;
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
              + .content {
                margin-top: 1.25em;
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
            }
          }
        }
      } // .updated-cullet-list
      .new-cullet-list {
        > .columns {
          margin: 0;

          > .column {
            padding: 0 .25rem;
          }
        }
        .item-list {
          padding: 0;

          &:not(:last-child) {
            margin-bottom: .75rem;
          }
          .new-cullet-card {
            .card-content {
              .media {
                margin-bottom: .25em;

                .media-left {
                  margin-right: .5rem;
                }
                .media-right {
                  margin-left: .5rem;
                }
                .media-content {
                  > :not(:last-child) {
                    margin-bottom: .25rem;
                  }
                }
              } // .media
            } // .card-content
          } // .new-cullet-card
        } // .item-list
      } // .new-cullet-list
    }
  }
</style>
