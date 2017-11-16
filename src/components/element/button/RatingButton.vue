<template>
  <element-button class="rating-button">
    <div>
      <i class="material-icons">star</i>
      <i class="material-icons">star</i>
      <i class="material-icons">star</i>
    </div>
    <span class="element-label">Rating</span>

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
  .rating-button {
    $amount: 2;

    .sub-content {
      height: $element-button-size * $amount;
    }
    > div {
      letter-spacing: -5px;

      > .material-icons {
        font-size: 1rem;
      }
    }
  }
</style>
