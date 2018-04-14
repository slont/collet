<template>
  <transition-group id="userpage-items" tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
    <div v-for="item in items" class="item-list column is-half" :key="item.id">
      <div class="new-cullet-card card">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <router-link class="theme-title subtitle text-color-weak is-size-7" tag="div"
                           :to="`/u/${$route.params.userId}/${item.theme.id}`">
                {{ item.theme.title }}
              </router-link>
              <router-link class="item-title text-color-strong is-size-5 has-text-weight-bold" tag="div"
                           :to="`/u/${$route.params.userId}/${item.theme.id}/${item.id}`">
                {{ item.name }}
              </router-link>
              <div class="updated-at text-color-weak is-size-8">
                <span class="icon"><i class="material-icons">access_time</i></span>
                <span>{{ item.updatedAt | fromNow }}</span>
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
      </div>
    </div>
  </transition-group>
</template>

<script>
  import UserModel from '@/models/User'
  import ItemModel from '@/models/Item'
  import itemCard from '@/components/item/ItemCard'
  import ElementView from '@/components/element/ElementView'
  const SIZE = 10

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
            s: this.size
          }).catch(err => {
            console.log(err)
            this.$message({
              showClose: true,
              message: 'データ取得に失敗しました',
              type: 'error'
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

    > .columns {
      padding-top: 1em;
    }

    @media screen and (max-width: 768px) {
      margin: 0;

      .item-list {
        padding: 0;
        margin: 1em 0;

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
        }
      } // .item-list
    }
  }
</style>
