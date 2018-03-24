<template>
  <div id="top-top">
    <carousel :per-page="1"
              :pagination-enabled="false"
              navigation-enabled
              navigation-prev-label=""
              navigation-next-label=""
              :autoplay-timeout="4000"
              autoplay loop>
      <slide v-for="theme in themes" :key="theme.id">
        <div class="card-image">
          <figure class="image is-16by9">
            <img :src="theme.image" v-if="theme.image">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" v-else>
          </figure>
          <div class="dark-mask" @click="$router.push(`/u/${theme.createdUser.id}/${theme.id}`)">
            <span class="private-icon icon" v-if="theme.private"><i class="material-icons">lock</i></span>

            <div class="title is-5 has-text-white">{{ theme.title }}</div>
            <div class="user-profile is-size-7">
              <figure class="image is-32x32" v-if="theme.createdUser.image">
                <img class="circle" :src="theme.createdUser.image">
              </figure>
              <div>
                <div @click.stop="$router.push(`/u/${theme.createdUser.id}`)">
              <span class="user-name has-text-white has-text-weight-bold">
                {{ theme.createdUser.name }}</span><span class="user-id has-text-grey-lighter">@{{ theme.createdUser.id }}</span>
                </div>
                <div class="updated-at has-text-grey-lighter">{{ theme.updatedAt && theme.updatedAt.format('YYYY/MM/DD HH:mm') }}</div>
              </div>
            </div>
          </div>
        </div>
      </slide>
    </carousel>

    <div class="updated-cullet-list columns is-multiline" v-if="user.id && updatedItems.length">
      <div class="updated-cullet-label column is-12" key="label">
        <label class="label">{{ user.name }}の更新一覧</label>
      </div>
      <div class="card">
        <transition-group tag="div" name="slide-fade" mode="out-in" class="item-list column is-12 card-content">
          <div v-for="item in updatedItems" class="updated-cullet" :key="item.id">
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
                <div class="updated-at text-color-weak is-size-8">
                  {{ item.updatedAt | fromNow }}
                </div>
              </div>

              <div class="media-right" v-if="item.theme.image">
                <figure class="image"><img :src="item.theme.image"></figure>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <transition-group tag="div" name="slide-fade" mode="out-in" class="new-cullet-list columns is-multiline">
      <div class="new-cullet-label column is-12" key="label">
        <label class="label">新着カレット一覧</label>
      </div>
      <div v-for="item in newItems" class="item-list column is-half" :key="item.id">
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

                <div class="user-profile is-size-7">
                  <figure class="image is-16x16" v-if="item.theme.createdUser.image">
                    <img class="circle" :src="item.theme.createdUser.image">
                  </figure>
                  <router-link :to="`/u/${item.theme.createdUser.id}`" class="user-name text-color-weak">
                    {{ item.theme.createdUser.name }}
                  </router-link>
                  <span class="updated-at text-color-weak is-size-8">- {{ item.updatedAt | fromNow }}</span>
                </div>
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

    <theme-edit-modal ref="themeEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ItemModel from '@/models/Item'
  import UserModel from '@/models/User'
  import FavoriteModel from '@/models/Favorite'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ItemCard from '@/components/item/ItemCard'
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { ThemeCard, ItemCard, ThemeEditModal, ElementView },
    data() {
      return {
        topThemes: [],
        themes: [],
        updatedItems: [],
        newItems: []
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        if (this.loggedIn) {
          new UserModel().findItems(this.user.id, {
            p: 0,
            s: 5
          }).then(res => {
            this.updatedItems = res.data
          })
        }

        new ItemModel().findByNew({
          p: 0,
          s: 20
        }).then(res => {
          this.newItems = res.data
        })

        new ThemeModel().findByNew({
          p: 0,
          s: 20
        }).then(async res1 => {
          this.themes = res1.data.map(theme => {
            theme.favorite = false
            return theme
          })
          if (this.loggedIn) {
            const res2 = await new FavoriteModel().find({
              themeIds: res1.data.map(theme => theme.id),
              userId: this.user.id
            })
            this.themes.forEach((theme, i) => Object.assign(theme, {
              favorite: !!res2.data[i].themeId
            }))
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
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #top-top {
    max-width: $width;
    margin-left: auto;
    margin-right: auto;
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
      .VueCarousel {
        .VueCarousel-navigation-prev {
          left: 10%;
          height: 100%;
          width: 10%;
        }
        .VueCarousel-navigation-next {
          right: 10%;
          height: 100%;
          width: 10%;
        }
        .card-image {
          overflow: visible;

          .image {
            overflow: hidden;
          }
          .dark-mask {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 1rem;
            background: linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .6));
            transition: all .3s ease;

            &:hover {
              background: linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .7));
              cursor: pointer;
            }
            .private-icon {
              position: absolute;
              top: .25rem;
              left: 1rem;
              height: 3rem;
            }
            .title {
              margin: 0;
            }
            .title {
              max-height: 80px;
              width: 100%;
              margin-bottom: 1rem;
              line-height: 1.25;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;

              &:hover {
                text-decoration: underline;
              }
            }
            .user-profile {
              display: flex;
              align-items: center;
              cursor: pointer;

              .image {
                margin-right: .5em;

                img {
                  height: 100%;
                }
              }
              .user-name {
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        } // .card-image
      } // VueCarousel
      .updated-cullet-list {
        margin: 0;

        .item-list {
          padding: 0;

          .updated-cullet {
            padding: .5em 1em;

            &:first-child {
              padding-top: 1em;
            }
            &:not(:first-child) {
              padding-top: 0;
            }
            &:last-child {
              .media {
                border-bottom: none;
              }
            }
            .media {
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
          }
        }
      } // .new-cullet-list
    }
  }
</style>
