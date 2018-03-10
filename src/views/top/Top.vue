<template>
  <div id="top-top">
    <carousel :per-page="1"
              :pagination-enabled="false"
              navigation-enabled
              navigation-prev-label=""
              navigation-next-label=""
              :autoplay-timeout="40000"
              autoplay loop>
      <slide v-for="theme in themes" :key="theme.id">
        <div class="card-image">
          <figure class="image is-16by9">
            <img :src="theme.image" v-if="theme.image">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" v-else>
          </figure>
          <div class="dark-mask" @click="$router.push(`/u/${theme.createdUser.id}/${theme.id}`)">
            <span class="private-icon icon" v-if="theme.private"><i class="material-icons">lock</i></span>

            <div class="title is-6 has-text-white">{{ theme.title }}</div>
            <div class="user-profile is-size-7">
              <figure class="image is-32x32" v-if="theme.createdUser.image">
                <img class="circle" :src="theme.createdUser.image">
              </figure>
              <div>
                <div @click.stop="$router.push(`/u/${theme.createdUser.id}`)">
              <span class="user-name has-text-white has-text-weight-bold">
                {{ theme.createdUser.name }}</span><span class="user-id has-text-grey-lighter">@{{ theme.createdUser.id }}</span>
                </div>
                <div class="updated-at has-text-grey-lighter">{{ theme.updatedAt && theme.updatedAt.format('YYYY/MM/DD HH:mm') }}</div>
              </div>
            </div>
          </div>
        </div>
      </slide>
    </carousel>

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
        topThemes: [],
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
      .VueCarousel {
        .VueCarousel-navigation-prev {
          left: 10%;
          height: 100%;
          width: 10%;
        }
        .VueCarousel-navigation-next {
          right: 10%;
          height: 100%;
          width: 10%;
        }
        .card-image {
          overflow: visible;

          .image {
            overflow: hidden;
          }
          .dark-mask {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 1rem;
            background: linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .6));
            transition: all .3s ease;

            &:hover {
              background: linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .7));
              cursor: pointer;
            }
            .private-icon {
              position: absolute;
              top: .25rem;
              left: 1rem;
              height: 3rem;
              color: #e8e8e8;
            }
            .title {
              margin: 0;
            }
            .title {
              max-height: 80px;
              width: 100%;
              margin-bottom: 1rem;
              line-height: 1.25;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              color: white;

              &:hover {
                text-decoration: underline;
              }
            }
            .user-profile {
              display: flex;
              align-items: center;
              cursor: pointer;

              .image {
                margin-right: .5em;
              }
              .user-name {
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
      .columns {
        margin: 0;

        .column {
          padding: 0;
        }
      }
    }
  }
</style>
