<template>
  <element-button class="location-button" icon="location_on" label="Location">
    <div class="buttons sub-content has-addons">
      <element-button class="photo-button" icon="photo" label="location">
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
  .location-button {
    .sub-content {
      width: $element-button-size * 2;
    }
  }
</style>
