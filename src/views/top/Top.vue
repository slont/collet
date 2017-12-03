<template>
  <div id="top-top">
    <article v-for="theme in themes" class="message is-primary">
      <div class="message-header">
        <div class="item-name">{{ theme.item.name }}</div>
        <div class="meta-data">
          <figure class="image is-16x16">
            <img :src="theme.user.image || 'https://bulma.io/images/placeholders/128x128.png'" class="circle">
          </figure>
          <div class="user-name">{{ theme.user.name }}</div>
          <div class="divider">-</div>
          <div class="theme-name">{{ theme.name }}</div>
        </div>
      </div>
      <div class="message-body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
      </div>
    </article>
    <a class="button button-create is-float is-primary circle">
      <i class="material-icons">add</i>
    </a>
  </div>
</template>

<script>
  export default {
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
  #top-top {
    width: $width;
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
  }
</style>
