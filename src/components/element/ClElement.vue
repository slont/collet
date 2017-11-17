<template>
  <div class="cl-element">
    <label class="label" v-if="params.label && !editable">
      {{ params.label }}
    </label>
    <div class="control label-control" v-else-if="editable">
      <input v-model.trim="params.label" class="input label" type="text" placeholder="Label">
      <a @click="$emit('remove')" class="delete"></a>
    </div>
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
  .cl-element {
    .label-control {
      display: flex;
      align-items: center;

      .label {
        padding-bottom: 0;
        box-shadow: none;
        border-top: none;
        border-right: none;
        border-left: none;
        border-bottom-width: 2px;
        border-radius: 0;
      }
    }
  }
</style>
