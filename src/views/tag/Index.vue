<template>
  <div id="tag-index">
    <header class="tag-header header-shadow">
      <span class="title is-4">{{ tagName }}</span>
    </header>

    <div id="tag-themes">
      <div class="columns is-multiline">
        <div v-for="theme in themes" class="column is-one-third-tablet" :key="theme.id">
          <theme-card :theme="theme" @open-edit-modal="$emit('open-edit-modal', theme)"></theme-card>
        </div>
      </div>
    </div>

    <a @click="$refs.themeCreateModal.open()" class="button button-create is-float is-primary circle">
      <i class="material-icons">add</i>
    </a>

    <theme-create-modal ref="themeCreateModal" @refresh="refresh"></theme-create-modal>
    <theme-edit-modal ref="themeEditModal" @refresh="refresh"></theme-edit-modal>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import FavoriteModel from '@/models/Favorite'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'

  export default {
    components: { ThemeCard, ThemeCreateModal, ThemeEditModal },
    data() {
      return {
        user: {
          id: '',
          name: '',
          biography: '',
          image: ''
        },
        themes: []
      }
    },
    computed: {
      tagName() {
        return this.$route.query.name
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
        new ThemeModel().findByTagName({
          tagName: this.tagName,
          p: 0,
          s: 20
        }).then(res => {
          this.themes = res.map(theme => {
            theme.favorite = false
            return theme
          })
          return new FavoriteModel().find({
            themeIds: res.map(theme => theme.id),
            userId: this.user.id
          })
        }).then(res => {
          this.themes.forEach((theme, i) => Object.assign(theme, {
            favorite: !!res[i].themeId
          }))
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
  #tag-index {
    .tag-header {
      background-color: white;

      .tabs {
        width: $width;
        margin-left: auto;
        margin-right: auto;

        > ul {
          border-bottom-color: transparent;

          li {
            a {
              border-bottom-width: 0;
            }
            &.router-link-active {
              @extend .is-active;
            }
          }
        }
      }
    }
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }
  }
</style>
