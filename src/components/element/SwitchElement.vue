<template>
  <cl-element class="switch-element" :params="params" icon="toll"
              @remove="$emit('remove')" :editable="editable">
    <p class="control">
      <input v-model.trim="params.valueStr" class="input" type="text">
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
  .switch-element {
  }
</style>
