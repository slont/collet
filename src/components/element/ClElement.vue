<template>
  <div class="cl-element">
    <label class="label control" v-if="params.label && !editable">
      {{ params.label }}
    </label>
    <div class="control label-control" v-else-if="editable">
      <i class="material-icons label" v-if="editable && icon">{{ icon }}</i>
      <input v-model.trim="params.label" class="input label" type="text" placeholder="Label">
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
      icon: String,
      iconElement: Object,
      editable: Boolean
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .cl-element {
    position: relative;

    .control {
      width: 100%;
    }
    .label-control {
      display: flex;
      align-items: center;

      .label {
        margin-bottom: -1px;
        padding-bottom: 0;
        box-shadow: none;
        border-top: none;
        border-right: none;
        border-left: none;
        border-radius: 0;
        z-index: 1;
      }
      .material-icons:not(:last-child) {
        font-size: 1.25rem;
        margin-bottom: 0;
      }
    }
    .input,
    .textarea {
      border-top-left-radius: 0;
      border-top-right-radius: 0;

      &:focus {
        z-index: 2;
      }
    }
  }
</style>
