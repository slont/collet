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

    <!--<a class="fixed-action-button button is-float is-primary circle">-->
      <!--<a @click="$refs.itemCreateModal.open(theme.templates)" class="button button-create is-float is-primary circle">-->
        <!--<i class="material-icons">add</i>-->
      <!--</a>-->
    <!--</a>-->

    <div class="fixed-action-button vertical">
      <a class="button trigger-button is-float is-primary circle">
        <i class="material-icons">add</i>
      </a>
      <ul>
        <li>
          <a class="button button-create is-float is-link circle"
             @click="$refs.itemCreateModal.open(theme.templates)">
            <i class="material-icons">insert_chart</i>
          </a>
        </li>
        <li>
          <a class="button button-create is-float is-info circle">
            <i class="material-icons">format_quote</i>
          </a>
        </li>
      </ul>
    </div>

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
    .fixed-action-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;

      &.vertical ul {
        position: absolute;
        display: inline-flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: flex-start;
        bottom: 0;
        height: 500px;
        width: 100%;
        padding-bottom: 64px;
        visibility: hidden;

        li {
          .button {
            height: 40px;
            width: 40px;
            margin: .5rem;
          }
        }
        &:hover {
          visibility: visible;
        }
      }
      .trigger-button {
        z-index: 100;

        .material-icons {
          transition: all .3s;
        }
      }
      &:hover {
        .trigger-button {
          .material-icons {
            transform: rotate(-135deg);
          }
          + ul {
            visibility: visible;
          }
        }
      }
    }
  }
</style>
