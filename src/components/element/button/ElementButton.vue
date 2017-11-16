<template>
  <a class="button element-button is-primary is-outlined">
    <i class="material-icons" v-if="icon">{{ icon }}</i>
    <span class="element-label" v-if="label">{{ label }}</span>

    <slot></slot>
  </a>
</template>

<script>
  export default {
    props: {
      icon: '',
      label: ''
    },
    data() {
      return {}
    },
    methods: {
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .element-button {
    &.button {
      height: $element-button-size;
      width: $element-button-size;
      border-radius: 0;
    }
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .material-icons {
      font-size: 2rem;
      height: 2.4rem;
      line-height: 2.4rem;
    }
    .label {
      font-size: .75rem;
    }
    .element-label {
      font-size: .75rem;
    }
    .sub-content {
      position: absolute;
      right: -$element-button-size;
      width: $element-button-size;
      display: none;

      &.has-addons .button:not(:last-child) {
        margin-right: 0;
      }
    }
    &:hover {
      z-index: 2;

      .sub-content {
        display: flex;
        flex-direction: column;
        background-color: white;
      }
    }
  }
</style>
