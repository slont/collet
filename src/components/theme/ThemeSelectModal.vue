<template>
  <modal id="theme-select-modal" class="modal" ref="themeSelectModal" @close="reset">
    <div class="modal-card-body">
      <div class="field current-theme" v-if="theme.title">
        <div class="control">
          <label class="label">選択中のテーマ</label>
          {{ theme.title }}
        </div>
      </div>

      <div class="field search-field">
        <div class="control has-icons-right">
          <input v-model="query" class="input is-rounded"
                 placeholder="テーマ検索"/>
          <span class="icon is-small is-right"><i class="material-icons">search</i></span>
        </div>
      </div>

      <aside class="theme-menu menu">
        <ul class="menu-list">
          <li @click="openThemeCreateModal">
            <a>
              <span>新規作成</span>
              <span class="icon"><i class="material-icons">add</i></span>
            </a>
            <div class="divider"></div>
          </li>

          <li v-for="theme in themes" :key="theme.id" @click="select(theme)">
            <a>
              <span>{{ theme.title }}</span>
              <span class="item-count">{{ theme.itemCount }}</span>
            </a>
            <div class="divider"></div>
          </li>
        </ul>
      </aside>
    </div>

    <button class="modal-close is-large" @click="close"></button>

    <theme-create-modal ref="themeCreateModal" @refresh="refresh"/>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import Modal from '@/components/Modal'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'

  export default {
    components: { Modal, ThemeCreateModal },
    data() {
      return {
        query: '',
        theme: {
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
        this.theme = theme
        this.refresh().then(() => {
          this.$refs.themeSelectModal.open()
        }).catch(err => this.$message.error(err))
      },
      close() {
        this.reset()
        this.$refs.themeSelectModal.close()
      },
      refresh() {
        return new ThemeModel().find({
          userId: this.user.id,
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
      .modal-card-body {
        margin-bottom: 0;
        padding: 1rem;

        .divider {
          margin: .5em;
          height: 1px;
          background-color: $border;
        }
      }
      .modal-close {
        color: $label-color;
      }
    }
  }
</style>
