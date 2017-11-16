<template>
  <element class="list-element" :params="params" :editable="editable">
    <p class="control">
      <input v-for="str in strs" v-model.trim="str" class="input" type="text">
    </p>
  </element>
</template>

<script>
  import Element from './Element'
  const DELIMITER = '- '

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
    },
    data() {
      return {
        strs: this.value.valueStr.split(DELIMITER)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .list-element {
  }
</style>
