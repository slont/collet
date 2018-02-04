<template>
  <div id="top-top">
    <label class="label">新着一覧</label>
    <transition-group name="slide-fade" mode="out-in" class="columns is-multiline">
      <div v-for="theme in themes" class="column is-half" :key="theme.id">
        <theme-card :theme="theme"
                    @open-edit-modal="$emit('open-edit-modal', theme)"
                    @refresh="refresh"></theme-card>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ThemeCard from '@/components/theme/ThemeCard'

  export default {
    components: { ThemeCard },
    data() {
      return {
        themes: []
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
        }).then(res => {
          this.themes = res.data.map(theme => {
            theme.favorite = false
            return theme
          })
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
  #top-top {
    width: $width;
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
  }
</style>
