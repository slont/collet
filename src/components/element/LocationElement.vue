<template>
  <cl-element class="location-element" :params="params" placeholder="ラベル（オプショナル）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">location_on</i>
    </span>
    <p class="control">
      <input v-model.trim="params.valueStr" class="input" type="text"
             @focus="$emit('focus')" @blur="$emit('blur')">
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
  .location-element {
  }
</style>
