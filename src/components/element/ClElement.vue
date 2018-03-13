<template>
  <div class="cl-element">
    <label class="view-label label control" v-if="params.label && !editable">
      {{ params.label }}
    </label>
    <div class="control label-control" v-else-if="editable">
      <input v-model.trim="params.label" class="input label" type="text" :placeholder="placeholder">
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import RatingIcon from '@/components/RatingIcon'

  export default {
    components: { RatingIcon },
    props: {
      params: {
        type: Object,
        default: {
          label: ''
        }
      },
      icon: String,
      editable: Boolean,
      placeholder: {
        type: String,
        default: 'Label'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .cl-element {
    position: relative;
    line-height: 1.25rem;

    .control {
      width: 100%;
    }
    .label {
      font-size: 1.5rem;

      &:not(:last-child) {
        margin-bottom: 1em;
      }
    }
    .view-label {
      border-bottom: $border-style;
    }
    .label-control {
      display: flex;
      align-items: center;

      .label {
        margin-bottom: -1px;
        padding-left: 0;
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
      .rating-icon {
        width: 1.315rem;

        .material-icons {
          font-size: .4rem !important;
        }
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
