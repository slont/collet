<template>
  <modal id="theme-select-modal" class="modal" ref="themeSelectModal" @close="reset">
    <header class="top-header action-modal-header modal-card-head">
      <span class="back-button icon is-size-3 is-hidden-tablet" @click="close">
        <i class="material-icons">arrow_back</i>
      </span>

      <span class="modal-card-title title is-6 has-text-white">テーマ選択</span>
    </header>

    <div class="modal-card-body">
      <aside class="theme-menu menu">
        <ul class="menu-list">
          <li class="create-item" @click="openThemeCreateModal">
            <a class="button is-primary is-outlined is-rounded is-size-5">
              <span>テーマ新規作成</span>
            </a>
            <div class="divider"></div>
          </li>

          <li v-for="theme in themes" :key="theme.id" class="theme-item"
              @click="select(theme)">
            <a>
              <span class="selected-icon icon is-size-4">
                <i class="fas fa-check text-color-main" v-show="selectedTheme.id === theme.id"></i>
              </span>
              <span class="private-icon icon is-size-5 text-color-weak" v-if="theme.private"><i class="fas fa-lock fa-fw"></i></span>
              <span class="theme-title is-size-6 has-text-weight-bold">{{ theme.title }}</span>
              <span class="item-count tag is-success is-rounded">{{ theme.itemCount }}</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>

    <theme-create-modal ref="themeCreateModal" @refresh="refresh"/>
  </modal>
</template>

<script>
  import UserModel from '@/models/User'
  import Modal from '@/components/Modal'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'

  export default {
    components: { Modal, ThemeCreateModal },
    data() {
      return {
        query: '',
        selectedTheme: {
          id: '',
          title: ''
        },
        themes: [],
        errorMessage: ''
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      open(theme = {}) {
        this.selectedTheme = theme
        this.refresh().then(() => {
          this.$refs.themeSelectModal.open()
        }).catch(err => this.$toast.open({
          message: err,
          type: 'is-danger'
        }))
      },
      close() {
        this.reset()
        this.$refs.themeSelectModal.close()
      },
      refresh() {
        return new UserModel().findThemes(this.user.id, {p: 1, s: 20, q: ''}).then(res => {
          this.themes = res.data
        })
      },
      select(theme) {
        this.$emit('refresh', theme)
        this.close()
      },
      openThemeCreateModal() {
        this.$refs.themeCreateModal.open()
      },
      reset() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #theme-select-modal {
    > .animation-content {
      > .modal-card {
        > .modal-card-body {
          .current-theme {
            .subtitle {
              margin-bottom: 0;
            }
          }
          .search-field {
            .subtitle {
              margin-bottom: 0;
            }
          }
          .create-item a {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .theme-item {
            border-bottom: $border-style;

            a {
              display: flex;
              align-items: center;
              padding: 1rem 0;

              .selected-icon {
                min-width: 32px;
                margin-right: .25rem;
              }
              .private-icon {
                margin-right: .5rem;
                color: gainsboro;
              }
              .item-count {
                min-width: 32px;
                height: 1.5em;
                margin-left: auto;
              }
              .theme-title {
                margin-right: .25rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          .divider {
            margin: .5em 0 0;
            height: 1px;
            background-color: $border;
          }
        }
      }

      @media screen and (min-width: 769px) {
        > .modal-card {
          > .modal-card-body {
            border-bottom-right-radius: $radius-large;
            border-bottom-left-radius: $radius-large;
          }
        }
      }
    }
  }
</style>
