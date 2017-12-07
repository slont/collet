<template>
  <div id="userpage-theme">
    <div class="theme-content">
      <div class="theme-items columns" v-if="theme.items.length">
        <div class="column is-4">
          <div class="theme-card card">
            <header class="theme-header">
              <div class="theme-image theme-header-content trim" v-if="theme.image">
                <figure class="theme-image image is-4by3">
                  <img :src="theme.image" v-if="theme.image">
                </figure>
                <div class="dark-mask">
                  <button class="button is-primary is-outlined" @click="$refs.themeEditModal.open(theme)" v-if="isMyPage">
                    <span class="icon"><i class="material-icons">edit</i></span>
                  </button>
                  <div class="title is-5">{{ theme.title }}</div>
                  <div class="user-profile">
                    <figure class="image is-16x16" v-if="user.image">
                      <img class="circle" :src="user.image">
                    </figure>
                    <router-link class="user-name" :to="`/${user.name}`">{{ user.name }}</router-link>
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
            <div class="card-content">
              <div class="subtitle is-6">{{ theme.description }}</div>
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

          <div>
            <div v-for="item in theme.items" :key="item.id">
              <item-card :theme="theme" :item="item" @click.native="currentItem = item"
                         @open-edit-modal="$refs.itemEditModal.open(item)"></item-card>
            </div>
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
        viewType: 0,
        currentItem: {
          id: ''
        }
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

      .theme-items {
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
                  height: 2.75rem;
                  color: white;
                  overflow: hidden;
                }
                .user-profile {
                  font-size: .75rem;
                  display: flex;
                  align-items: center;

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
          .theme-sub-header {
            border-bottom: $border;

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
