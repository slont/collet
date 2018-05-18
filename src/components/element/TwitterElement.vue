<template>
  <cl-element class="twitter-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon fa-icon icon is-left is-size-6" v-if="editable">
      <i class="fab fa-twitter"></i>
    </span>
    <p class="control">
      <input v-model.trim="params.valueStr" class="input" type="text" v-if="editable"
             @focus="$emit('focus')" @blur="$emit('blur')" placeholder="IDまたはリンクURL">

      <Tweet :id="id" v-if="id"/>
    </p>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'
  import Tweet from 'vue-tweet-embed/tweet'

  const REGEX = /.*(https?:\/\/twitter\.com\/\w+?\/\w+?\/(\d+)).*/

  export default {
    components: {ClElement, Tweet},
    props: {
      params: {
        type: Object,
        default: {
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        }
      },
      editable: Boolean
    },
    computed: {
      id: vue => {
        if (REGEX.test(vue.params.valueStr)) {
          return vue.params.valueStr.replace(REGEX, '$2')
        } else {
          return vue.params.valueStr
        }
      }
    },
    watch: {
      'params.valueStr'(e) {
        if (REGEX.test(e)) {
          this.params.valueStr = this.params.valueStr.replace(REGEX, '$1')
        } else {
          this.params.valueStr = this.params.valueStr.replace(/.*?(\d+).*/, '$1')
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .twitter-element {
    .input {
      padding-top: .25em;
      padding-left: .25em;
      border-left: none;
      border-top: none;
      border-right: none;
      border-radius: 0;
      box-shadow: none;

      &:focus, &:active {
        border-color: $primary;
      }
      & + div {
        .twitter-tweet {
          width: 50% !important;
        }
      }
    }
    .twitter-tweet {
      margin: 1em auto;
    }
  }
</style>
