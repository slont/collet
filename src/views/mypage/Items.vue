<template>
  <div id="mypage-index">
    <div class="columns is-multiline">
      <div v-for="theme in themes" class="column is-one-third-tablet" :key="theme.id">
        <theme-card :theme="theme"></theme-card>
      </div>
    </div>
    <a class="button button-create is-float is-primary circle">
      <i class="material-icons">add</i>
    </a>
  </div>
</template>

<script>
  import ThemeCard from '@/components/theme/ThemeCard'

  export default {
    components: { ThemeCard },
    data() {
      return {
        themes: [
          {
            id: 'aaa',
            name: '1000円台でオススメのワイン',
            description: '1000円台でオススメのワインを紹介します',
            image: '',
            user: {
              id: 'aaa',
              image: '',
              name: 'hogehoge'
            },
            item: {
              name: 'Evodia',
              elements: []
            }
          }, {
            id: 'bbb',
            name: 'オススメの日本酒',
            description: 'オススメの日本酒を紹介します',
            image: '',
            user: {
              id: 'aaa',
              image: '',
              name: 'hogehoge'
            },
            item: {
              name: '〆張鶴',
              elements: []
            }
          }, {
            id: 'ccc',
            name: 'デートに使えるお店',
            description: 'デートに使えるお店を紹介します',
            image: '',
            user: {
              id: 'aaa',
              image: '',
              name: 'hogehoge'
            },
            item: {
              name: 'マチュリテ',
              elements: []
            }
          }, {
            id: 'ddd',
            name: 'デートに使えるお店2',
            description: 'デートに使えるお店を紹介します',
            image: '',
            user: {
              id: 'aaa',
              image: '',
              name: 'hogehoge'
            },
            item: {
              name: 'レトノ',
              elements: []
            }
          }
        ]
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #mypage-index {
    padding-top: 1em;
  }
</style>
