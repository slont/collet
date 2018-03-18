<template>
  <cl-element class="text-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable">
    <span class="element-type-icon icon is-small is-left" v-if="editable">
      <i class="material-icons">text_fields</i>
    </span>
    <p class="control">
      <textarea v-model="params.valueStr" v-autosize="params.valueStr" class="textarea" rows="2" placeholder="Text"
                v-if="editable"></textarea>

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
  .text-element {
    .value {
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
</style>
