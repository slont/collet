<template>
  <transition-group id="userpage-items" tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
    <div v-for="item in items" class="item-list column is-half" :key="item.id">
      <div class="new-cullet-card card">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <router-link class="theme-title subtitle text-color-weak is-size-7" tag="div"
                           :to="`/u/${item.theme.createdUser.id}/${item.theme.id}`">
                {{ item.theme.title }}
              </router-link>
              <router-link class="item-title text-color-strong is-size-5 has-text-weight-bold" tag="div"
                           :to="`/u/${item.theme.createdUser.id}/${item.theme.id}/${item.id}`">
                {{ item.name }}
              </router-link>
            </div>

            <div class="media-right" v-if="item.theme.image">
              <figure class="image"><img :src="item.theme.image"></figure>
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
  import FavoriteModel from '@/models/Favorite'
  import itemCard from '@/components/item/itemCard'
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { itemCard, ElementView },
    data() {
      return {
        items: []
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
      this.refresh()
    },
    methods: {
      refresh() {
        new UserModel().findItems(this.urlUserId, {
          p: 0,
          s: 20
        }).then(res => {
          this.items = res.data
          if (this.loggedIn) {
            return new FavoriteModel().find({
              itemIds: res.data.map(item => item.id),
              userId: this.selfUser.id
            })
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
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
                  display: flex;
                  align-items: center;

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
                margin-top: .5em;
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
        }
      } // .item-list
    }
  }
</style>
