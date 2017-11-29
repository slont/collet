<template>
  <cl-element class="rating-element" :params="params" placeholder="レーティング"
              @remove="$emit('remove')" :editable="editable">
    <p class="control">
      <el-rate v-model="params.valueNum" :max="Number(params.valueStr)" :disabled="!editable"></el-rate>
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
  .rating-element {
  }
</style>
