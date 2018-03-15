<template>
  <div id="userpage-item">
    <router-link :to="`/u/${$route.params.userId}/${themeId}`" tag="div"
                 class="theme-title is-size-7 text-color-weak">
      {{ theme.title }}
    </router-link>

    <div class="item-info">
      <div class="title is-3">
        {{ item.name }}
        <a class="edit-button button is-info is-outlined is-hidden-mobile"
           @click="$refs.itemEditModal.open(theme, item)" v-if="isMyPage">
          <span class="icon"><i class="material-icons">edit</i></span>
          <span>編集</span>
        </a>
        <a class="edit-button button is-info is-outlined is-hidden-tablet"
           @click="$router.push(`/m/editItem/${theme.id}/${item.id}`)" v-if="isMyPage">
          <span class="icon"><i class="material-icons">edit</i></span>
          <span>編集</span>
        </a>
      </div>
    </div>

    <div class="item-elements">
      <div v-for="(element, i) in item.elements" :key="i" class="field element-field">
        <element-view :element="element"/>
      </div>
    </div>

    <item-edit-modal ref="itemEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ItemModel from '@/models/Item'
  import ItemEditModal from '@/components/item/ItemEditModal'
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { ItemEditModal, ElementView },
    props: {
      currentItem: {
        type: Object,
        default: () => ({
          id: ''
        })
      }
    },
    data() {
      return {
        theme: {
          id: '',
          title: ''
        },
        item: {
          title: '',
          elements: []
        }
      }
    },
    computed: {
      isMyPage() {
        return this.$store.state.user.id === this.$route.params.userId
      },
      themeId() {
        return this.$route.params.themeId
      },
      itemId() {
        return this.currentItem.id || this.$route.params.itemId
      }
    },
    watch: {
      'currentItem.id': 'refresh'
    },
    mounted() {
      this.refresh()
    },
    methods: {
      refresh() {
        new ItemModel(this.themeId).findOne(this.itemId).then(res => {
          this.item = res.data
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
        new ThemeModel().findOne(this.themeId).then(res => {
          this.theme = res.data
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-item {
    .theme-title {
      margin-top: -.5rem;
      margin-bottom: .5rem;
      text-decoration: underline;
    }
    .edit-button {
      margin-bottom: .5rem;

      .icon i {
        font-size: $size-5;
      }
    }
    .item-info {
      margin-bottom: 2rem;

      .title {
        border-bottom: $border-style;
      }
      .subtitle {
        line-height: inherit;
      }
      .image {
        img {
          width: 70%;
          margin: auto;
        }
      }
    }
  }
</style>
