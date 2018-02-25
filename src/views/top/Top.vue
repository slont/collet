<template>
  <div id="top-top">
    <transition-group name="slide-fade" mode="out-in" class="columns is-multiline">
      <div class="column is-12" key="label">
        <label class="label">新着一覧</label>
      </div>
      <div v-for="theme in themes" class="column is-half" :key="theme.id">
        <theme-card :theme="theme"
                    @open-edit-modal="openEditModal(theme)"
                    @refresh="refresh"/>
      </div>
    </transition-group>

    <theme-edit-modal ref="themeEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import FavoriteModel from '@/models/Favorite'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ThemeCard from '@/components/theme/ThemeCard'

  export default {
    components: { ThemeCard, ThemeEditModal },
    data() {
      return {
        themes: []
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
        new ThemeModel().findByNew({
          userId: this.urlUserId,
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
      .columns {
        margin: 0;

        .column {
          padding: 0;
        }
      }
    }
  }
</style>
