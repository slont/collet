<template>
  <element-button class="text-button" icon="text_fields" label="Text">
    <div class="buttons sub-content has-addons">
      <element-button class="photo-button" icon="photo" label="Image">
      </element-button>
      <element-button class="photo-button" icon="location_on" label="Location">
      </element-button>
    </div>
  </element-button>
</template>

<script>
  import ElementButton from './ElementButton'

  export default {
    components: { ElementButton },
    data() {
      return {}
    },
    methods: {
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .text-button {
    $amount: 2;

    .sub-content {
      height: $element-button-size * $amount;
    }
  }
</style>
