<template>
  <div id="mypage-theme">
    <div class="theme-image trim" v-if="theme.image">
      <figure class="image is-4by3">
        <img :src="theme.image" v-if="theme.image">
      </figure>
      <div class="dark-mask" @click="$router.push(`/mypage/${theme.id}`)">
        <div class="title is-3">
          {{ theme.title }}
          <button class="button is-primary is-inverted is-outlined">
            <span class="icon"><i class="material-icons">edit</i></span>
          </button>
        </div>
        <div class="subtitle is-6">{{ theme.description }}</div>
      </div>
    </div>
    <div v-else>
      <div class="title is-3">{{ theme.title }}</div>
      <div class="subtitle is-6">{{ theme.description }}</div>
    </div>

    <div class="search-box">
      <div class="field has-addons">
        <div class="control">
          <input class="input" type="text" placeholder="Find a repository">
        </div>
        <div class="control">
          <a class="button is-info">
            <span class="icon"><i class="material-icons">search</i></span>
          </a>
        </div>
      </div>

      <div class="action-buttons">
        <button class="button" v-if="0 === viewType" @click="viewType = 1">
          <span class="icon"><i class="material-icons">view_list</i></span>
        </button>
        <button class="button" v-else-if="1 === viewType" @click="viewType = 0">
          <span class="icon"><i class="material-icons">view_module</i></span>
        </button>
      </div>
    </div>

    <div class="theme-items tile is-ancestor" v-if="theme.items.length && 0 === viewType">
      <div v-for="item in theme.items" class="tile is-parent is-4" :key="item.id">
        <my-item-card :theme="theme" :item="item" @open-edit-modal="$refs.itemEditModal.open(item)"></my-item-card>
      </div>
    </div>

    <table class="theme-items table" v-else-if="theme.items.length && 1 === viewType">
      <tbody>
      <tr v-for="item in theme.items" :key="item.id">
        <th class="image-cell" @click="$router.push(`/mypage/${theme.id}/${item.id}`)">
          <img :src="item.image || 'https://bulma.io/images/placeholders/1280x960.png'" alt="Placeholder image">
        </th>
        <td class="title-cell">
          <router-link :to="`/mypage/${theme.id}/${item.id}`" class="title is-4">{{ item.name }}</router-link>
          <p>{{ item.description }}</p>
        </td>
        <td class="action-cell">
          <span class="icon has-text-primary"><i class="material-icons">edit</i></span>
          <span class="icon has-text-danger"><i class="material-icons">clear</i></span>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="box" v-else>
      まだアイテムが追加されていません
      右下のボタンからアイテムを追加してみましょう！
    </div>

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
    <item-edit-modal ref="itemEditModal" @refresh="refresh"></item-edit-modal>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import MyItemCard from '@/components/item/MyItemCard'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
  import ItemEditModal from '@/components/item/ItemEditModal'

  export default {
    components: { ItemCreateModal, ItemEditModal, MyItemCard },
    data() {
      return {
        theme: {
          title: '',
          items: []
        },
        viewType: 0
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
  #mypage-theme {
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
    .search-box {
      display: flex;
      align-items: center;
      padding: 1rem;

      .action-buttons {
        margin-left: auto;
      }
    }
    .theme-items {
      &.tile {
        flex-wrap: wrap;

        .media-content {
          .title:hover {
            text-decoration: underline;
          }
        }
      }
      &.table {
        width: 100%;

        .image-cell {
          width: 6rem;
          height: 6rem;
          padding: 0;
          vertical-align: middle;
          cursor: pointer;

          img {
            margin-bottom: -6px;
          }
        }
        .title-cell {
          .title:hover {
            text-decoration: underline;
          }
        }
        .action-cell {
          width: 6rem;
          vertical-align: middle;
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
