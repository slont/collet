<template>
  <element-button class="datetime-button" icon="schedule" label="DateTime">
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
  .datetime-button {
    .sub-content {
      width: $element-button-size * 2;
    }
  }
</style>
