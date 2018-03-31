<template>
  <cl-element class="email-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">mail_outline</i>
    </span>
    <p class="control">
      <input v-model.trim="params.valueStr" class="input" type="email" v-if="editable"
             @focus="$emit('focus')" @blur="$emit('blur')">

      <span class="value" v-else>{{ params.valueStr }}</span>
    </p>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'

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
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .email-element {
  }
</style>
