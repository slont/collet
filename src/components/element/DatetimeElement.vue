<template>
  <cl-element class="datetime-element" :params="params"
              @remove="$emit('remove')" :editable="editable">
    <p class="control">
      <el-date-picker v-model="params.valueStr" :type="params.type" placeholder="Select date and time"></el-date-picker>
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
  .datetime-element {
  }
</style>
