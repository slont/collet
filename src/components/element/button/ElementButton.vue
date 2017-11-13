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
    .element-label {
      font-size: .75rem;
    }
    .sub-content {
      position: absolute;
      top: -$element-button-size;
      height: $element-button-size;
      display: none;
    }
    &:hover {
      z-index: 2;

      .sub-content {
        display: block;
      }
    }
  }
</style>
