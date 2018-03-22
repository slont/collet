<template>
  <cl-element class="datetime-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-small is-left" v-if="editable">
      <i class="material-icons">schedule</i>
    </span>
    <p class="control">
      <el-date-picker v-model="params.valueStr" :type="params.type" placeholder="Select date and time"
                      @focus="$emit('focus')" @blur="$emit('blur')"/>
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
