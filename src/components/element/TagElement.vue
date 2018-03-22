<template>
  <cl-element class="tag-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-small is-left" v-if="editable">
      <i class="material-icons">label_outline</i>
    </span>
    <p class="control">
      <input v-model.trim="params.valueStr" class="input" type="text"
             @focus="$emit('focus')" @blur="$emit('blur')">
    </p>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'
  const DELIMITER = '- '

  export default {
    components: { ClElement },
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
    data() {
      return {
        strs: this.value.valueStr.split(DELIMITER)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .tag-element {
  }
</style>
