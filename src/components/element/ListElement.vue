<template>
  <cl-element class="list-element" :params="params" :editable="editable">
    <p class="control">
      <input v-for="str in strs" v-model.trim="str" class="input" type="text" v-if="editable">

      <span v-for="str in strs" class="value" v-else>{{ str }}</span>
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
  .list-element {
  }
</style>
