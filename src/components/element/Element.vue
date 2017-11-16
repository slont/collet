<template>
  <div class="element">
    <label v-if="params.label && !editable">
      {{ params.label }}
    </label>
    <p class="control" v-else-if="editable">
      <input v-model.trim="params.label" class="input" type="text" placeholder="Label">
    </p>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      params: {
        type: Object,
        default: {
          label: ''
        }
      },
      editable: Boolean
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .element {
  }
</style>
