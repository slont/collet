<template>
  <transition-group id="userpage-items" tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
    <div v-for="(key) in Object.keys(itemsColumns)" class="column is-12-mobile is-6-tablet" :key="`column-${key}`">
      <div v-for="item in itemsColumns[key]" class="item-list" :key="item.id" v-if="itemsColumns[key].length">
        <router-link :to="`/u/${$route.params.userId}/${item.theme.id}/${item.id}`"
                     tag="div" class="cullet-card card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <router-link class="theme-title subtitle text-color-weak is-size-7 clickable" tag="div"
                             :to="`/u/${$route.params.userId}/${item.theme.id}`">
                  {{ item.theme.title }}
                  <span class="icon" v-if="item.theme.private"><i class="fas fa-lock fa-fw"></i></span>
                </router-link>
                <div class="item-title text-color-strong is-size-4 has-text-weight-bold clickable">
                  {{ item.name }}
                </div>
                <div class="updated-at text-color-weak is-size-8">
                  <span class="icon"><i class="far fa-clock"></i></span>
                  <span>{{ fromNow(item.updatedAt, 'YYYY/MM/DD') }}</span>
                </div>
              </div>

              <div class="media-right" v-if="item.theme.image">
                <figure class="image"><img :src="item.theme.image" :srcset="`${item.theme.image}_640w 640w`"></figure>
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
    <div class="button is-loading fullwidth is-large" key="loading" v-if="items.length < itemsTotal"></div>
  </transition-group>
</template>

<script>
  import UserModel from '@/models/User'
  import ItemModel from '@/models/Item'
  import itemCard from '@/components/item/ItemCard'
  import ElementView from '@/components/element/ElementView'
  const SIZE = 12

  export default {
    components: { itemCard, ElementView },
    data() {
      return {
        items: [],
        size: SIZE,
        itemsTotal: 10000
      }
    },
    computed: {
      selfUser() {
        return this.$store.state.user
      },
      urlUserId() {
        return this.$route.params.userId
      },
      itemsColumns() {
        if (this.isMobile) {
          return {
            0: this.items,
            1: []
          }
        } else {
          return {
            0: this.items.filter((item, i) => 0 === i % 2),
            1: this.items.filter((item, i) => 1 === i % 2)
          }
        }
      }
    },
    watch: {
      '$route.params.userId': 'refresh'
    },
    created() {
      if (this.urlUserId === this.selfUser.id) {
        Object.assign(this.items, new ItemModel().deserialize(this.$store.state.items).slice(0, this.size))
      }
      this.refresh()
    },
    methods: {
      async refresh() {
        await this.fetch(1)
        if (this.loggedIn && this.urlUserId === this.selfUser.id) {
          this.$store.commit('SET_ITEMS', this.items)
        }
      },
      async fetch(page) {
        if (this.items.length < this.itemsTotal) {
          const res = await new UserModel().findItems(this.urlUserId, {
            p: null != page ? page : Math.floor(this.items.length / this.size) + 1,
            s: this.size,
            q: ''
          }).catch(err => {
            console.log(err)
            this.$toast.open({
              message: 'データ取得に失敗しました',
              type: 'is-danger'
            })
          })
          if (res.data) {
            if (1 === page || 0 === Math.floor(this.items.length / this.size)) {
              this.items = res.data
            } else {
              this.items.push(...res.data)
            }
            this.itemsTotal = res.headers.get('X-Page-Total')
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-items {
    max-width: $width;
    margin: 0 auto;

    .item-list {
      padding: 0;
      margin: 0 0 1em;

      .cullet-card {
        &:hover {
          cursor: pointer;
        }
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
                  max-height: 24em;
                  margin: 0;
                  overflow: hidden;
                }
              }
            }
          }
        } // .card-content
      }
    } // .item-list

    @media screen and (min-width: 769px) {
      .item-list {
      }
    }

    @media screen and (max-width: 768px) {
      margin: .25rem;

      > .column {
        padding: 0;
      }
    }
  }
</style>
