<template>
  <div id="userpage-themes">
    <div class="columns is-multiline">
      <div v-for="theme in themes" class="column is-one-third-tablet" :key="theme.id">
        <theme-card :theme="theme" @open-edit-modal="$emit('open-edit-modal', theme)"></theme-card>
      </div>
    </div>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import FavoriteModel from '@/models/Favorite'
  import ThemeCard from '@/components/theme/ThemeCard'

  export default {
    components: { ThemeCard },
    data() {
      return {
        themes: []
      }
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        const userId = this.urlUserId
        new ThemeModel().find({
          userId: userId,
          favorite: false,
          p: 0,
          s: 20
        }).then(res => {
          this.themes = res.map(theme => {
            theme.favorite = false
            return theme
          })
          return new FavoriteModel().find({
            themeIds: res.map(theme => theme.id),
            userId: userId
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-themes {
    width: $width;
    margin: 0 auto;

    > .columns {
      padding-top: 1em;
    }
  }
</style>
