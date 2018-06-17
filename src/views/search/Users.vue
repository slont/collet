<template>
  <div id="search-users">
    <div v-if="isLastFetch && !users.length">
      ヒットする検索結果がありません
    </div>
    <transition-group tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
      <div v-for="user in users" class="column is-half" :key="user.id">
        <div class="card">
          <div class="card-content media">
            <div class="media-left">
              <figure class="image circle flexbox" v-if="user.image">
                <user-image :src="user.image"/>
              </figure>
              <span class="icon is-size-1" v-else><i class="far fa-user-circle"></i></span>
            </div>
            <div class="media-content">
              <p class="is-size-5 text-color-weak">
                <router-link :to="`/u/${user.id}`" class="text-color-weak">
                  <span class="has-text-weight-bold clickable">{{ user.name }}</span>
                  <span>@{{ user.id }}</span>
                </router-link>
              </p>

              <p>{{ user.description }}             aaaaaaaaaaaaaaaaaaaa</p>
            </div>
          </div>
        </div>
      </div>
      <div class="button is-loading fullwidth is-large" key="loading" v-if="!isLastFetch"></div>
    </transition-group>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
  import Items from '@/components/item/Items'
  const SIZE = 12

  export default {
    components: {Items},
    data() {
      return {
        users: [],
        page: 1,
        isFetching: false,
        isLastFetch: false
      }
    },
    computed: {
      q: ({$route}) => $route.query.q || ''
    },
    watch: {
      '$route.query.q'(e) {
        if (null == e) return

        Object.assign(this.$data, this.$options.data.call(this))
        this.fetch()
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      fetch(page) {
        if (this.isFetching || this.isLastFetch) return

        this.isFetching = true
        new UserModel().find({p: this.page, s: SIZE, q: this.q}).then(res => {
          if (1 === page) {
            this.users = res.data
          } else {
            this.users.push(...res.data)
          }
          this.page++
          this.isFetching = false
          if (res.data.length < SIZE) {
            this.isLastFetch = true
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
  #search-users {
    max-width: $width;
    margin: 0 auto;

    > .columns {
      margin: 0;
    }
    .media {
      background-color: white;

      .media-left {
        height: 40px;
        width: 40px;
      }
    }

    @media screen and (max-width: 768px) {
      > .columns {
        > .column {
          padding: .25rem;
        }
      }
    }
  }
</style>
