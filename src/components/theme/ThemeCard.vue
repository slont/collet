<template>
  <div class="theme-card">
    <figure class="theme-image image flexbox">
      <img :src="theme.image" :srcset="`${theme.image}_640w 640w`" v-if="theme.image">
      <img src="/static/img/cullet-logo_orange.png" class="alt-image" alt="Placeholder image" v-else>
    </figure>
    <!--<a class="add-item-button button is-info is-rounded" v-if="isMyTheme && visibleAddItem">カレット新規追加</a>-->

    <div class="dark-mask" @click="$router.push(`/u/${theme.createdUser.id}/${theme.id}`)">
      <header class="">
        <div class="item-count has-text-weight-bold">
          <span class="count is-size-3">{{ theme.itemCount }}</span>
          <span class="is-size-8">カレット</span>
        </div>
        <div class="theme-tags tags is-size-8" v-if="theme.tags.length">
          <el-tag v-for="tag in theme.tags" :key="tag.tagId" type="warning"
                  @click.native.stop="$router.push({path: `/s/themes?p=1&s=20&q=%23${tag.name}`})">
            #{{ tag.name }}
          </el-tag>
        </div>
      </header>

      <div class="user-profile flexbox is-size-7">
        <figure class="image circle is-16x16 flexbox" v-if="theme.createdUser.image">
          <user-image :src="theme.createdUser.image"/>
        </figure>
        <div @click.stop="$router.push(`/u/${theme.createdUser.id}`)">
            <span class="user-name has-text-white has-text-weight-bold clickable">
              {{ theme.createdUser.name }}</span><span class="user-id has-text-grey-lighter">@{{ theme.createdUser.id }}</span>
        </div>
        <div class="updated-at has-text-grey-lighter" v-if="theme.updatedAt">
          ・{{ fromNow(theme.updatedAt, 'YYYY/MM/DD') }}
        </div>
      </div>

      <div class="title is-5 has-text-white">
        <span class="private-icon icon is-size-6 has-text-white" v-if="theme.private"><i class="fas fa-lock fa-fw"></i></span>
        <span>{{ theme.title }}</span>
      </div>

      <nav class="theme-actions actions level is-mobile is-size-4">
        <div class="level-left">
          <a class="favorite-action level-item" :class="{ 'is-active': theme.favorite }">
            <span class="icon" @click.stop.prevent="onClickFavorite">
              <i class="fa-heart fa-pull-left" :class="[theme.favorite ? 'fas' : 'far']"></i>
            </span>
            <span class="favorite-count count has-text-weight-bold" v-if="theme.favoriteCount">
              {{ theme.favoriteCount }}
            </span>
          </a>
        </div>
        <div class="level-right">
          <a class="edit-action level-item">
            <span class="icon" @click.stop.prevent="$emit('open-edit-modal')" v-if="loggedIn && isMyTheme">
              <i class="fas fa-ellipsis-h"></i>
            </span>
          </a>
        </div>
      </nav>
    </div>

    <!--<div class="card-content media">-->
      <!--<div class="media-content">-->
        <!--<div class="theme-tags tags is-size-7" v-if="theme.tags.length">-->
          <!--<el-tag v-for="tag in theme.tags" :key="tag.tagId" type="warning"-->
                  <!--@click.native.stop="$router.push(`/tag?name=${tag.name}`)">-->
            <!--#{{ tag.name }}-->
          <!--</el-tag>-->
        <!--</div>-->

        <!--<div class="theme-description content is-size-7" v-if="theme.description">{{ theme.description }}</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'

  export default {
    props: {
      theme: Object,
      visibleAddItem: Boolean
    },
    computed: {
      user: ({$store}) => $store.state.user,
      urlUserId: ({$route}) => $route.params.userId,
      isMyTheme: ({$store, theme}) => $store.state.user.id === theme.createdUser.id
    },
    methods: {
      onClickFavorite() {
        if (this.loggedIn) {
          this.doFavorite().then(res => {
            this.theme.favoriteCount += this.theme.favorite ? -1 : 1
            this.theme.favorite = !this.theme.favorite
          })
        } else {
          this.$confirm('アカウントを作成すると、テーマをお気に入りに追加できるようになります！', '', {
            type: 'info',
            showCancelButton: false,
            showConfirmButton: false
          })
        }
      },
      doFavorite() {
        if (this.theme.favorite) {
          return new ThemeModel().deleteFavorite(this.theme.id, this.user.id)
        } else {
          return new ThemeModel().updateFavorite(this.theme.id, this.user.id)
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .theme-card {
    position: relative;
    border-radius: 5px;
    background-color: white;

    .theme-image {
      height: 11rem;
    }
    .add-item-button,
    .add-button {
      position: absolute;
      bottom: 1em;
      right: 1em;

      &:not(:hover) {
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
    .dark-mask {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      padding: .5rem .75rem;
      background: linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, .8));
      border-radius: 5px;
      transition: all .3s ease;

      &:hover {
        background: linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .7));
        cursor: pointer;
      }
      header {
        margin-bottom: auto;
        text-align: right;

        .theme-tags {
          justify-content: flex-end;
          margin-bottom: 0;
          color: white;

          .el-tag--warning {
            background-color: rgba(230, 162, 60, 0.5);
            border-color: rgba(230, 162, 60, 0.4);
            color: white;
          }
        }
        .item-count {
          margin-bottom: .25rem;
          line-height: 1;
          color: rgba(white, .9);
        }
      }
      .title {
        max-height: 80px;
        width: 100%;
        margin: 0;
        margin-bottom: .5em;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: white;

        &:hover {
          text-decoration: underline;
        }
      }
      .user-profile {
        margin-bottom: .25rem;
        cursor: pointer;

        .image {
          margin-right: .5em;
        }
        .level-left {
          filter: drop-shadow(0px 0px 3px rgba(255,255,255,0.6));
        }
      }
    }
    .card-content.media {
      .media-content {
        overflow: initial;

        .theme-description + .actions {
          padding-top: .5em;
          border-top: $border-style;
        }
      }
    }

    @media screen and (min-width: 769px) {
    }

    @media screen and (max-width: 768px) {
    }
  }
</style>
