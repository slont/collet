<template>
  <div id="userpage-theme">
    <div class="theme-content">
      <div class="theme-columns columns">
        <div class="column is-4">
          <div class="theme-card card">
            <header class="theme-header">
              <div class="theme-image theme-header-content trim" v-if="theme.image">
                <figure class="theme-image image is-16by9">
                  <img :src="theme.image" v-if="theme.image">
                </figure>
                <div class="dark-mask">
                  <div class="title is-5">{{ theme.title }}</div>
                  <div class="user-profile" @click="$router.push(`/${theme.createdUser.id}`)">
                    <figure class="image is-16x16" v-if="theme.createdUser.image">
                      <img class="circle" :src="theme.createdUser.image">
                    </figure>
                    <span class="user-name has-text-weight-bold">{{ theme.createdUser.name }}</span>
                    <span class="user-id">@{{ theme.createdUser.id }}</span>
                    <span class="updated-at">- {{ theme.updatedAt && theme.updatedAt.format('YYYY/MM/DD') }}</span>
                  </div>
                  <div class="theme-tags tags" v-if="theme.tags.length">
                    <a v-for="tag in theme.tags" class="tag is-primary"
                       @click.stop="$router.push(`/tag?name=${tag.name}`)">#{{ tag.name }}</a>
                  </div>
                </div>
              </div>

              <div class="theme-profile theme-header-content" v-else>
                <div class="title is-5">{{ theme.title }}</div>
                <div class="user-profile" @click="$router.push(`/${theme.createdUser.id}`)">
                  <figure class="image is-16x16" v-if="theme.createdUser.image">
                    <img class="circle" :src="theme.createdUser.image">
                  </figure>
                  <span class="user-name has-text-weight-bold">{{ theme.createdUser.name }}</span>
                  <span class="user-id">@{{ theme.createdUser.id }}</span>
                  <span class="updated-at">- {{ theme.updatedAt && theme.updatedAt.format('YYYY/MM/DD') }}</span>
                </div>
                <div class="theme-tags tags" v-if="theme.tags.length">
                  <a v-for="tag in theme.tags" class="tag is-primary"
                     @click.stop="$router.push(`/tag?name=${tag.name}`)">#{{ tag.name }}</a>
                </div>
              </div>

              <div class="favorite-action" @click.stop.prevent="onClickFavorite">
                <span class="icon">
                  <i class="favorite material-icons" v-if="theme.favorite">star</i>
                  <i class="material-icons" v-else>star_border</i>
                </span>
                <span class="favorite-count" v-if="theme.favoriteCount">{{ theme.favoriteCount }}</span>
              </div>

              <div class="edit-action" @click.stop.prevent="$refs.themeEditModal.open(theme)" v-if="isMyPage">
                <span class="icon"><i class="material-icons">more_horiz</i></span>
              </div>
            </header>

            <div class="theme-description card-content">
              <div class="subtitle is-6" :class="{ 'is-opened': openedThemeDescription }">{{ theme.description }}</div>
              <a class="button is-text is-small" @click="openedThemeDescription = !openedThemeDescription">
                {{ openedThemeDescription ? '閉じる' : '詳しく見る' }}
              </a>
            </div>
          </div>

          <div class="theme-sub-header">
            <div class="search-box">
              <div class="field has-addons">
                <div class="input-control control">
                  <input class="input" type="text" placeholder="Find a repository">
                </div>
                <div class="control">
                  <a class="button is-info">
                    <span class="icon"><i class="material-icons">search</i></span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="theme-items">
            <div class="subtitle is-7">アイテム一覧</div>
            <item-card  v-for="item in theme.items" :key="item.id" :theme="theme" :item="item"
                        :class="{ 'is-active': currentItem.id === item.id }"
                        @click.native="currentItem = item"
                        v-if="theme.items.length"></item-card>
          </div>
        </div>

        <div class="column is-8" v-if="theme.items.length">
          <item-page :current-item="currentItem"></item-page>
        </div>

        <div v-else>
          まだアイテムはありません
          <template v-if="isMyPage">
            <br/>右下のボタンからアイテムを追加してみましょう！
          </template>
        </div>
      </div>
    </div>

    <div class="fixed-action-button vertical">
      <a class="button trigger-button is-float is-primary circle">
        <i class="material-icons">add</i>
      </a>
      <ul>
        <li>
          <el-tooltip content="新規アイテム" placement="left">
            <a class="button button-create is-float is-link circle"
               @click="$refs.itemCreateModal.open()">
              <i class="material-icons">add</i>
            </a>
          </el-tooltip>
        </li>
        <li v-for="template in theme.templates">
          <el-tooltip content="テンプレート" placement="left">
            <a class="button button-template is-float is-info circle"
               @click="$refs.itemCreateModal.open(template)">
              <i class="material-icons">assignment</i>
            </a>
          </el-tooltip>
        </li>
      </ul>
    </div>

    <theme-edit-modal ref="themeEditModal" @refresh="refresh"></theme-edit-modal>
    <item-create-modal ref="itemCreateModal" @refresh="refresh"></item-create-modal>
    <item-edit-modal ref="itemEditModal" @refresh="refresh"></item-edit-modal>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ItemCard from '@/components/item/ItemCard'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
  import ItemEditModal from '@/components/item/ItemEditModal'
  import ItemPage from './Item'

  export default {
    components: { ThemeEditModal, ItemCreateModal, ItemEditModal, ItemCard, ItemPage },
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
      selfUser() {
        return this.$store.state.user
      },
      urlUserId() {
        return this.$route.params.userId
      },
      isMyPage() {
        return this.$store.state.user.id === this.urlUserId
      },
      themeId() {
        return this.$route.params.themeId
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        const themeModel = new ThemeModel()
        themeModel.findOne(this.themeId).then(res => {
          Object.assign(this.theme, res)
          if (this.theme.items.length) {
            this.currentItem = this.theme.items[0]
          }
          return themeModel.findOneFavorite(this.theme.id, this.selfUser.id)
        }).then(res => {
          this.theme.favorite = !!res.themeId
        }, () => {
          // through the NotFound favorite error
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      onClickFavorite() {
        this.clickFavorite().then(res => {
          this.theme.favoriteCount += this.theme.favorite ? -1 : 1
          this.theme.favorite = !this.theme.favorite
        })
      },
      clickFavorite() {
        if (this.theme.favorite) {
          return new ThemeModel().deleteFavorite(this.theme.id, this.selfUser.id)
        } else {
          return new ThemeModel().updateFavorite(this.theme.id, this.selfUser.id)
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-theme {
    background-color: white;

    .theme-content {
      height: 100vh;
      width: 90%;
      margin: 0 auto;

      .theme-columns {
        height: 100%;
        width: 100%;
        margin: 0;

        > div {
          overflow: scroll;

          .theme-header {
            position: relative;

            .theme-header-content {
              position: relative;
              max-height: 14rem;
              min-height: 11.5rem;
              flex-direction: column;
              display: flex;
              justify-content: flex-end;

              .theme-image {
                width: 100%;
              }
              .title {
                max-height: 4.5rem;
                line-height: 1.25;
                overflow: hidden;
              }
              .user-profile {
                font-size: .875rem;
                cursor: pointer;

                .user-name:hover {
                  text-decoration: underline;
                }
                .user-id {
                  color: $label-color;
                }
                .updated-at {
                  color: $label-color;
                }
              }
              > :not(:last-child) {
                margin-bottom: .5rem;
              }
              .dark-mask {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                padding: .75rem;

                > :not(:last-child) {
                  margin-bottom: .5rem;
                }
                .title {
                  color: white;
                }
                .user-profile {
                  font-size: .875rem;
                  cursor: pointer;

                  .user-name {
                    color: white;

                    &:hover {
                      text-decoration: underline;
                    }
                  }
                  .user-id {
                    color: gainsboro;
                  }
                  .updated-at {
                    color: gainsboro;
                  }
                }
              }
              &.theme-image {
                display: flex;
                align-items: center;
              }
              &.theme-profile {
                padding: .75rem .75rem 0;

                .theme-tags {
                  border-bottom: $border-style;
                }
              }
            }
            .favorite-action {
              display: flex;
              align-items: center;
              position: absolute;
              top: .5rem;
              left: 0;
              padding: .25rem .4rem .25rem .25rem;
              background-color: rgba(0, 0, 0, .5);
              border: 1px solid white;
              border-left: none;
              border-bottom-right-radius: 5px;
              border-top-right-radius: 5px;
              cursor: pointer;

              .material-icons {
                font-size: 18px;
                color: rgba(255, 255, 255, .6);

                &.favorite {
                  color: #ebeb00;
                }
              }
              .favorite-count {
                margin-bottom: -.25rem;
                color: white;
              }
              &:hover {
                opacity: .8;
              }
            }
            .edit-action {
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 0;
              right: 0;
              height: 3rem;
              width: 3rem;
              cursor: pointer;

              &:hover {
                opacity: .65;
              }
            }
            .theme-image + .favorite-action + .edit-action {
              color: #e8e8e8;
            }
          }
          .theme-description {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-bottom: .5rem;

            .subtitle {
              max-height: 3.75rem;
              margin-bottom: 0;
              line-height: 1.25;
              overflow: hidden;
              transition: max-height .3s;
            }
            .is-opened {
              max-height: 100vh;
              transition: max-height .5s;
            }
            .button {
              margin: auto;
            }
          }
          .theme-sub-header {
            .search-box {
              width: 100%;
              margin: 0 auto;
              display: flex;
              align-items: center;
              padding: .5rem 0;

              .field {
                width: 100%;
                margin-bottom: 0;

                .input-control {
                  width: 100%;
                }
              }
              .action-buttons {
                margin-left: auto;
              }
            }
          }
        }
        .theme-items {
          .subtitle {
            text-align: center;
            margin: .5rem auto;
          }
          .item-card {
            &.is-active {
              .card-content {
                padding: calc(1rem - 3px);
                border: 3px solid $primary;
              }
            }
            &:hover {
              transform: scale(1.03);
              z-index: 1;
            }
          }
        }
      }
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
  }
</style>
