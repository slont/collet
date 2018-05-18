<template>
  <div id="tag-index">
    <header class="tag-header header-shadow">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <div class="title is-4">#{{ tagName }}</div>
          </div>
        </div>
      </article>
    </header>

    <div class="tag-themes">
      <transition-group name="slide-fade" mode="out-in" class="columns is-multiline">
        <div v-for="theme in themes" class="column is-half" :key="theme.id">
          <theme-card :theme="theme" @open-edit-modal="$emit('open-edit-modal', theme)"></theme-card>
        </div>
      </transition-group>
    </div>

    <a @click="$refs.themeCreateModal.open()" v-if="loggedIn"
       class="button button-create is-float is-primary circle is-hidden-mobile">
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
        themes: []
      }
    },
    computed: {
      selfUser: vue => vue.$store.state.user,
      tagName: vue => vue.$route.query.name
    },
    watch: {
      '$route.query.name': 'refresh'
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        new ThemeModel().findByTagName({
          tagName: this.tagName,
          p: 1,
          s: 20
        }).then(res => {
          this.themes = res.data.map(theme => {
            theme.favorite = false
            return theme
          })
          if (this.loggedIn) {
            return new FavoriteModel().find({
              themeIds: res.data.map(theme => theme.id),
              userId: this.selfUser.id
            })
          }
        }).then(res => {
          if (this.loggedIn) {
            this.themes.forEach((theme, i) => Object.assign(theme, {
              favorite: !!res.data[i].themeId
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
  #tag-index {
    .tag-header {
      background-color: white;

      .media {
        max-width: $width;
        margin-left: auto;
        margin-right: auto;
        padding: 1rem .5rem .5rem;

        .content {
          margin-bottom: 0;
        }
      }
    }
    .tag-themes {
      max-width: $width;
      margin: 0 auto;
      padding-top: 1em;
    }
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }

    @media screen and (max-width: 768px) {
      .columns {
        margin: 0;

        .column {
          padding: 0;
        }
      }
    }
  }
</style>
