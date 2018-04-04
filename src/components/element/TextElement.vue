<template>
  <cl-element class="text-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">text_fields</i>
    </span>
    <p class="control">
      <textarea v-model="params.valueStr" v-autosize="params.valueStr" class="textarea" rows="2" placeholder="Text"
                @focus="$emit('focus')" @blur="$emit('blur')" v-if="editable"></textarea>

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
    .textarea {
      padding-top: .25em;
      padding-left: .25em;
      border-left: none;
      border-top: none;
      border-right: none;
      border-radius: 0;
      box-shadow: none;

      &:focus, &:active {
        border-color: $primary;
      }
    }
    .value {
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
</style>
