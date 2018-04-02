<template>
  <modal id="theme-select-modal" class="modal" ref="themeSelectModal" @close="reset">
    <header class="top-header modal-card-head">
      <span class="back-button icon is-size-3" @click="close">
        <i class="material-icons">arrow_back</i>
      </span>

      <span class="modal-card-title title is-6 has-text-white">テーマ選択</span>
    </header>

    <div class="modal-card-body">
      <aside class="theme-menu menu">
        <ul class="menu-list">
          <li class="create-item" @click="openThemeCreateModal">
            <a class="button is-primary is-outlined is-size-5">
              <span>テーマ新規作成</span>
            </a>
            <div class="divider"></div>
          </li>

          <li v-for="theme in themes" :key="theme.id" class="theme-item"
              @click="select(theme)">
            <a>
              <span class="selected-icon icon is-size-4">
                <i class="material-icons text-color-main" v-show="selectedTheme.id === theme.id">check</i>
              </span>
              <span class="theme-title is-size-6 has-text-weight-bold">{{ theme.title }}</span>
              <span class="icon has-text-success is-size-4" v-if="theme.private"><i class="material-icons">lock</i></span>
              <span class="item-count text-color-weak">({{ theme.itemCount }})</span>
            </a>
            <div class="divider"></div>
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
        }).catch(err => this.$message.error(err))
      },
      close() {
        this.reset()
        this.$refs.themeSelectModal.close()
      },
      refresh() {
        return new UserModel().findThemes(this.user.id, {
          p: 0,
          s: 20
        }).then(res => {
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
    > .modal-card {
      .modal-card-head {
        height: 3rem;
        padding: 1em;
        color: white;
        background-color: $main-color;
        border: none;

        .back-button {
          margin-right: 1em;
        }
      }
      .modal-card-body {
        margin-bottom: 0;
        padding: 1rem;

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
        }
        .theme-item a {
          display: flex;
          align-items: center;
          padding-left: 0;

          .selected-icon {
            min-width: 32px;
            margin-right: .5rem;
          }
          .item-count {
            min-width: 32px;
            text-align: right;
          }
          .theme-title + .icon,
          .theme-title + .item-count {
            margin-left: auto;
          }
        }
        .divider {
          margin: .5em 0;
          height: 1px;
          background-color: $border;
        }
      }
    }
  }
</style>
