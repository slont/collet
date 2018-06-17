<template>
  <items id="search-my-items" v-model="items" :is-last-fetch="isLastFetch"/>
</template>

<script>
  import UserModel from '@/models/User'
  import Items from '@/components/item/Items'
  const SIZE = 12

  export default {
    components: {Items},
    data() {
      return {
        items: [],
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
        new UserModel().findItems(this.selfUser.id, {p: this.page, s: SIZE, q: this.q}).then(res => {
          if (1 === page) {
            this.items = res.data
          } else {
            this.items.push(...res.data)
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
  #search-my-items {
    max-width: $width;
    margin: 0 auto;

    @media screen and (max-width: 768px) {
      margin: .25rem;

      > .column {
        padding: 0;
      }
    }
  }
</style>
