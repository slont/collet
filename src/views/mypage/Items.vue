<template>
  <div id="mypage-items">
    <div class="theme-image trim" v-if="theme.image">
      <figure class="image is-4by3">
        <img :src="theme.image" v-if="theme.image">
      </figure>
      <div class="dark-mask" @click="$router.push(`/mypage/${theme.id}`)">
        <div class="title is-3">{{ theme.title }}</div>
        <div class="subtitle is-6">{{ theme.description }}</div>
      </div>
    </div>
    <div v-else>
      <div class="title is-3">{{ theme.title }}</div>
      <div class="subtitle is-6">{{ theme.description }}</div>
    </div>

    <div class="columns is-multiline" v-if="theme.items.length">
      <div v-for="item in theme.items" class="column is-one-third-tablet" :key="item.id">
      </div>
    </div>
    <div class="box" v-else>
      まだアイテムが追加されていません
      右下のボタンからアイテムを追加してみましょう！
    </div>

    <a @click="$refs.itemCreateModal.open(theme.templates)" class="button button-create is-float is-primary circle">
      <i class="material-icons">add</i>
    </a>

    <item-create-modal ref="itemCreateModal" @refresh="refresh"></item-create-modal>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ItemCreateModal from '@/components/item/ItemCreateModal'

  export default {
    components: { ItemCreateModal },
    data() {
      return {
        theme: {
          title: '',
          items: []
        }
      }
    },
    computed: {
      themeId() {
        return this.$route.params.themeId
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        new ThemeModel().findOne(this.themeId).then(res => {
          this.theme = res
          console.log(res)
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #mypage-items {
    padding-top: 1em;

    .theme-image {
      position: relative;
      display: flex;
      align-items: center;
      max-height: 14rem;

      .image {
        width: 100%;
      }
      .dark-mask {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        padding: .75rem;

        .title {
          color: white;
          padding-bottom: 1rem;
        }
        .subtitle {
          color: white;
        }
      }
    }
  }
</style>
