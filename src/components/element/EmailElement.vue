<template>
  <element class="email-element" :params="params" :editable="editable">
    <p class="control">
      <input v-model.trim="params.valueStr" class="input" type="email">
    </p>
  </element>
</template>

<script>
  import Element from './Element'

  export default {
    components: { Element },
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
