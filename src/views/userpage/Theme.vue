<template>
  <div id="userpage-theme">
    <div class="theme-content">
      <div class="theme-columns columns" v-if="theme.items.length">
        <div class="column is-4">
          <div class="theme-card card">
            <header class="theme-header">
              <div class="theme-image theme-header-content trim" v-if="theme.image">
                <figure class="theme-image image is-4by3">
                  <img :src="theme.image" v-if="theme.image">
                </figure>
                <div class="dark-mask">
                  <button class="button is-info is-outlined" @click="$refs.themeEditModal.open(theme)" v-if="isMyPage">
                    <span class="icon"><i class="material-icons">edit</i></span>
                  </button>
                  <div class="title is-5">{{ theme.title }}</div>
                  <div class="user-profile" @click="$router.push(`/${user.name}`)">
                    <figure class="image is-16x16" v-if="user.image">
                      <img class="circle" :src="user.image">
                    </figure>
                    <span class="user-name">{{ user.name }}</span>
                    <span class="updated-at">- {{ theme.updatedAt.format('YYYY/MM/DD') }}</span>
                  </div>
                  <div class="theme-tags" v-if="theme.tags.length">
                    <span v-for="tag in theme.tags" class="tag is-info">{{ tag.name }}</span>
                  </div>
                </div>
              </div>
              <div class="theme-profile theme-header-content" v-else>
                <div class="title is-5">{{ theme.title }}</div>
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
                        @click.native="currentItem = item" @open-edit-modal="$refs.itemEditModal.open(item)"></item-card>
          </div>
        </div>

        <div class="column is-8">
          <item-page :current-item="currentItem"></item-page>
        </div>
      </div>

      <div class="box" v-else>
        まだアイテムが追加されていません
        右下のボタンからアイテムを追加してみましょう！
      </div>
    </div>

    <div class="fixed-action-button vertical">
      <a class="button trigger-button is-float is-primary circle">
        <i class="material-icons">add</i>
      </a>
      <ul>
        <li>
          <a class="button button-create is-float is-link circle"
             @click="$refs.itemCreateModal.open(theme.templates)">
            <i class="material-icons">insert_chart</i>
          </a>
        </li>
        <li>
          <a class="button button-create is-float is-info circle">
            <i class="material-icons">format_quote</i>
          </a>
        </li>
      </ul>
    </div>

    <theme-edit-modal ref="themeEditModal" @refresh="refresh"></theme-edit-modal>
    <item-create-modal ref="itemCreateModal" @refresh="refresh"></item-create-modal>
    <item-edit-modal ref="itemEditModal" @refresh="refresh"></item-edit-modal>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
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
          items: []
        },
        user: {
          name: '',
          image: ''
        },
        currentItem: {
          id: ''
        },
        openedThemeDescription: false
      }
    },
    computed: {
      urlUserName() {
        return this.$route.params.userName
      },
      isMyPage() {
        return this.$store.state.user.name === this.urlUserName
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
        new UserModel().findOne(this.urlUserName).then(res => {
          this.user = res
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
        new ThemeModel().findOne(this.themeId).then(res => {
          this.theme = res
          if (this.theme.items.length) {
            this.currentItem = this.theme.items[0]
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
            .theme-header-content {
              position: relative;
              max-height: 14rem;

              .theme-image {
                width: 100%;
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
                  max-height: 6.25rem;
                  line-height: 1.25;
                  color: white;
                  overflow: hidden;
                }
                .user-profile {
                  font-size: .75rem;
                  display: flex;
                  align-items: center;
                  cursor: pointer;

                  > :not(:last-child) {
                    margin-right: .3rem;
                  }
                  .user-name,
                  .updated-at {
                    color: white;
                  }
                }
                .button {
                  position: absolute;
                  top: 0;
                  right: 0;
                  margin: .3rem;
                }
              }
              &.theme-image {
                display: flex;
                align-items: center;
              }
              &.theme-profile {
                padding: .75rem 0;
              }
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
