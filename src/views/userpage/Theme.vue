<template>
  <div id="userpage-theme">
    <div class="theme-content">
      <div class="theme-columns columns">
        <div class="side-column column is-4">
          <theme-card :theme="theme"
                      @open-edit-modal="$refs.themeEditModal.open(theme)"
                      @refresh="refresh"/>

          <!--<div class="theme-sub-header">
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
          </div>-->

          <div class="theme-items">
            <el-button type="primary" plain round size="mini" class="add-button"
                       @click="$refs.itemCreateModal.open(theme)" v-if="isMyPage">
              アイテム新規追加
            </el-button>
            <div class="subtitle is-7">
              <span>アイテム一覧</span>
            </div>
            <item-card v-for="item in theme.items" :key="item.id" :theme="theme" :item="item"
                       :class="{ 'is-active': currentItem.id === item.id }"
                       @click.native="$router.push(`/${urlUserId}/${themeId}/${item.id}`)"
                       @open-edit-modal="$refs.itemEditModal.open(theme, item)"
                       v-if="theme.items.length"/>
          </div>
        </div>

        <div class="main-column column is-8 is-hidden-mobile" v-if="currentItem.id">
          <item-page :current-item="currentItem"/>
        </div>

        <div v-else>
          まだアイテムはありません
          <template v-if="isMyPage">
            <br/>右下のボタンからアイテムを追加してみましょう！
          </template>
        </div>
      </div>
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
  import ThemeCard from '@/components/theme/ThemeCard'
  import ItemCard from '@/components/item/ItemCard'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
  import ItemEditModal from '@/components/item/ItemEditModal'
  import ItemPage from './Item'

  export default {
    components: { ThemeCard, ThemeEditModal, ItemCreateModal, ItemEditModal, ItemCard, ItemPage },
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
      itemId() {
        return this.$route.params.itemId
      },
      isMyPage() {
        return this.$store.state.user.id === this.urlUserId
      },
      themeId() {
        return this.$route.params.themeId
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
        themeModel.findOne(this.themeId).then(res => {
          Object.assign(this.theme, res.data)

          if (itemId) {
            this.refreshItem(itemId)
          } else if (this.theme.items.length) {
            this.currentItem = this.theme.items[0]
          }
          if (this.loggedIn) {
            return themeModel.findOneFavorite(this.theme.id, this.selfUser.id)
          }
        }).then(res => {
          if (this.loggedIn) {
            this.theme.favorite = !!res.data.themeId
          }
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
      refreshItem(itemId) {
        new ItemModel(this.theme.id).findOne(itemId).then(res => {
          this.currentItem = res.data
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

        .main-column {
          padding-left: 2rem;
        }
        > .column {
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
                display: flex;
                align-items: center;
                cursor: pointer;

                :not(:last-child) {
                  margin-right: .3em;
                }
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
                  display: flex;
                  align-items: center;
                  cursor: pointer;

                  :not(:last-child) {
                    margin-right: .3em;
                  }
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
            .private-icon {
              position: absolute;
              top: 0;
              right: 3rem;
              height: 3rem;
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
            .theme-image + .favorite-action + .private-icon,
            .theme-image + .favorite-action + .edit-action,
            .theme-image + .favorite-action + .private-icon + .edit-action {
              color: #e8e8e8;
            }
          }
          .theme-description {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
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
              padding: 1rem 0 .5rem;

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
          position: relative;
          margin-top: 1.5rem;

          .add-button {
            position: absolute;
            top: -6px;
            right: 0;

            .icon i {
              font-size: $size-6;
            }
          }
          .subtitle {
            text-align: center;
            margin: .75rem auto;
          }
          .item-card {
            &.is-active {
              .card-content {
                padding: calc(1rem - 3px);
                border: 3px solid $info;
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
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }

    @media screen and (max-width: 768px) {
      .theme-content {
        width: 100%;
        margin: 0;
      }
      .columns {
        margin: 0;

        .column {
          padding: 0;
        }
      }
    }
  }
</style>
