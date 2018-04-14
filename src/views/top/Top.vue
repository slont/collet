<template>
  <div id="top-top" @scroll="infiniteScroll">
    <div class="updated-cullet-list columns is-multiline" v-if="user.id && updatedItems.length">
      <div class="updated-cullet-label column is-12" key="label">
        <router-link :to="`/u/${user.id}`" tag="label" class="label is-size-5 has-text-centered">
          {{ user.name }}の更新一覧
        </router-link>
      </div>
      <div class="card">
        <transition-group tag="div" name="slide-fade" mode="out-in" class="item-list column is-12 card-content">
          <div v-for="(item, i) in updatedItems" class="updated-cullet flexbox" :key="item.id">
            <div class="updated-at text-color-weak has-text-weight-bold has-text-right">
              <div v-if="visibleUpdatedAt(item.updatedAt, i)">{{ item.updatedAt | fromNow('M/D') }}</div>
            </div>

            <div class="media">
              <div class="media-content">
                <router-link class="theme-title subtitle text-color-weak is-size-7" tag="div"
                             :to="`/u/${user.id}/${item.theme.id}`">
                  {{ item.theme.title }}
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
        </transition-group>
      </div>
    </div>

    <transition-group tag="div" name="slide-fade" mode="out-in" class="new-cullet-list columns is-multiline">
      <div class="new-cullet-label column is-12" key="label">
        <label class="label is-size-5 has-text-centered">新着カレット一覧</label>
      </div>
      <div v-for="item in newItems" class="item-list column is-half" :key="item.id">
        <router-link :to="`/u/${item.theme.createdUser.id}/${item.theme.id}/${item.id}`"
                     tag="div" class="new-cullet-card card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <router-link class="theme-title subtitle text-color-weak is-size-7" tag="div"
                             :to="`/u/${item.theme.createdUser.id}/${item.theme.id}`">
                  {{ item.theme.title }}
                </router-link>
                <div class="item-title text-color-strong is-size-5 has-text-weight-bold">
                  {{ item.name }}
                </div>

                <div class="user-profile flexbox has-align-centered is-size-7">
                  <figure class="image is-16x16" v-if="item.theme.createdUser.image">
                    <img class="circle" :src="item.theme.createdUser.image" :srcset="`${item.theme.createdUser.image}_640w 640w`">
                  </figure>
                  <router-link :to="`/u/${item.theme.createdUser.id}`" class="user-name text-color-weak">
                    {{ item.theme.createdUser.name }}
                  </router-link>
                  <span class="updated-at text-color-weak is-size-8">- {{ item.updatedAt | fromNow }}</span>
                </div>
              </div>

              <div class="media-right" v-if="item.theme.image">
                <figure class="image"><img :src="item.theme.image" :srcset="`${item.theme.image}_640w 640w`"></figure>
              </div>
            </div>

            <div class="content" v-if="item.elements.length">
              <element-view :element="item.elements[0]"/>
              <element-view :element="item.elements[1]" v-if="item.elements[1]"/>
            </div>
          </div>
        </router-link>
      </div>
    </transition-group>

    <theme-edit-modal ref="themeEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ItemModel from '@/models/Item'
  import UserModel from '@/models/User'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ItemCard from '@/components/item/ItemCard'
  import ElementView from '@/components/element/ElementView'
  const SIZE = 10

  export default {
    components: { ThemeCard, ItemCard, ThemeEditModal, ElementView },
    data() {
      return {
        topThemes: [],
        updatedItems: [],
        newItems: [],
        size: SIZE,
        newItemsTotal: 10000
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    created() {
      if (this.loggedIn) {
        Object.assign(this.updatedItems, new ItemModel().deserialize(this.$store.state.items).slice(0, 5))
      }
      this.refresh()
    },
    methods: {
      refresh() {
        if (this.loggedIn) {
          new UserModel().findItems(this.user.id, {
            p: 1,
            s: 5
          }).then(res => {
            this.updatedItems = res.data
          })
        }

        this.fetchNewItems()
      },
      fetchNewItems() {
        new ItemModel().findByNew({
          p: Math.floor(this.newItems.length / this.size) + 1,
          s: this.size
        }).then(res => {
          if (0 === Math.floor(this.newItems.length / this.size)) {
            this.newItems = res.data
          } else {
            this.newItems.push(...res.data)
          }
          this.newItemsTotal = res.headers.get('X-Page-Total')
        })
      },
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      },
      visibleUpdatedAt(updatedAt, index) {
        if (index === this.updatedItems.length - 1) {
          return true
        } else if (24 > this.$moment().diff(updatedAt, 'hours')) {
          return true
        }
        return 0 !== this.updatedItems[index + 1].updatedAt.diff(updatedAt, 'days')
      },
      infiniteScroll(event) {
        if (event.target.scrollHeight <= event.target.scrollTop + event.target.offsetHeight && this.newItems.length < this.newItemsTotal) {
          this.fetchNewItems()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #top-top {
    height: calc(100vh - #{$header-nav-height});
    max-width: $width;
    margin-left: auto;
    margin-right: auto;
    overflow: scroll;
    background-color: $bg-color-main;

    .new-cullet-list {
      .new-cullet-label {
        padding: .75em 1em;
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

    @media screen and (max-width: 768px) {
      height: calc(100vh - #{$header-nav-height + $footer-nav-height});

      .updated-cullet-list {
        margin: 0;

        .item-list {
          padding: 0;

          .updated-cullet {
            align-items: flex-end;
            padding: .5em 1em;

            &:first-child {
              padding-top: 1em;
            }
            &:not(:first-child) {
              padding-top: 0;
            }
            &:last-child {
              .updated-at div,
              .media {
                border-bottom: none;
              }
            }
            > div {
              min-width: 74px;
            }
            .updated-at {
              > div {
                padding-right: 1em;
                padding-bottom: .45em;
                border-bottom: $border-style;
              }
            }
            .media {
              flex: 1;
              padding-bottom: .5em;
              border-bottom: $border-style;

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
                  line-height: 1.25;
                  overflow: hidden;
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
        margin: 0;

        .item-list {
          padding: 0;

          &:not(:last-child) {
            margin-bottom: 1em;
          }
          .new-cullet-card {
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
                    line-height: 1.25;
                    overflow: hidden;
                  }
                  .user-profile {
                    > :not(:last-child) {
                      margin-right: .35em;
                    }
                    .image img {
                      max-height: 100%;
                    }
                  }
                }
                .media-right {
                  .image {
                    height: 60px;
                    overflow: hidden;

                    img {
                      height: 100%;
                      width: auto;
                    }
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
            } // .card-content
            .element-view {
              .text-element {
                .control {
                  max-height: 164px;
                  overflow: hidden;

                  .value {
                    line-height: 1.5rem;
                  }
                }
              }
              .image-element {
                .file-view {
                  display: flex;
                  align-items: center;
                  max-height: 16em;
                  margin: 0;
                  overflow: hidden;
                }
              }
            }
          } // .new-cullet-card
        }
      } // .new-cullet-list
    }
  }
</style>
