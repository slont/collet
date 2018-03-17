<template>
  <div id="userpage-favorites">
    <transition-group name="slide-fade" mode="out-in" class="columns is-multiline">
      <div v-for="theme in themes" class="column is-half" :key="theme.id">
        <theme-card :theme="theme" @open-edit-modal="$emit('open-edit-modal', theme)"/>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
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
      selfUser() {
        return this.$store.state.user
      },
      urlUserId() {
        return this.$route.params.userId
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
        new UserModel().findByFavorite(this.urlUserId, {
          p: 0,
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-favorites {
    max-width: $width;

    > .columns {
      padding-top: 1em;
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
