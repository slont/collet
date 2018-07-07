<template>
  <themes id="search-my-themes" v-model="themes" :is-last-fetch="isLastFetch"
          @open-edit-modal="openEditModal"></themes>
</template>

<script>
  import UserModel from '@/models/User'
  import FavoriteModel from '@/models/Favorite'
  import Themes from '@/components/theme/Themes'
  const SIZE = 10

  export default {
    components: {Themes},
    data() {
      return {
        themes: [],
        page: 1,
        isFetching: false,
        isLastFetch: false
      }
    },
    computed: {
      selfUser: ({$store}) => $store.state.user,
      q: ({$route}) => $route.query.q || ''
    },
    watch: {
      '$route.query.q'(e) {
        if (null == e) return

        const isFetching = this.isFetching
        Object.assign(this.$data, this.$options.data.call(this))
        this.isFetching = isFetching
        this.fetch()
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      fetch() {
        if (this.isFetching || this.isLastFetch) return

        this.isFetching = true
        new UserModel().findThemes(this.selfUser.id, {p: this.page, s: SIZE, q: this.q.replace('　', ' ')}).then(res => {
          const themes = res.data.map(theme => {
            theme.favorite = false
            return theme
          })
          if (1 === this.page) {
            this.themes = themes
          } else {
            this.themes.push(...themes)
          }
          this.page++
          this.isFetching = false
          if (themes.length < SIZE) {
            this.isLastFetch = true
            return
          }

          // fetch favorite
          return new FavoriteModel().find({
            themeIds: themes.map(theme => theme.id),
            userId: this.selfUser.id
          })
        }).then(res => {
          if (!res) return

          this.themes.slice(this.themes.length - SIZE).forEach((theme, i) => Object.assign(theme, {
            favorite: !!res.data[i].themeId
          }))
        }).catch(err => {
          this.isFetching = false
          console.log(err)
          this.$toast.open({
            message: 'データ取得に失敗しました',
            type: 'is-danger'
          })
        })
      },
      openEditModal(theme) {
        this.$emit('open-edit-modal', theme)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #search-my-themes {
    max-width: $width;
    margin: 0 auto;

    > .columns {
      padding-top: 1em;
    }

    @media screen and (min-width: 769px) {
      .theme-card {
        .card-image > .image,
        .dark-mask {
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
        }
      }
    }

    @media screen and (max-width: 768px) {
      .columns {
        margin: 0;

        .column {
          padding: .25rem;
        }
      }
    }
  }
</style>
