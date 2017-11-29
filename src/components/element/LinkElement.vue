<template>
  <cl-element class="link-element" :params="params" icon="link"
              @remove="$emit('remove')" :editable="editable">
    <p class="control">
      <input v-model.trim="params.valueStr" class="input value" type="text" v-if="editable">

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
  .link-element {
    .value {
      color: $link;
      text-decoration: underline;
    }
  }
</style>
