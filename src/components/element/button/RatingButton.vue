<template>
  <element-button class="rating-button"
                  @click.native="addElement">
    <rating-icon></rating-icon>
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
  import RatingIcon from '@/components/RatingIcon'
  import { ELEMENT } from '@/constant'

  export default {
    components: { ElementButton, RatingIcon },
    data() {
      return {}
    },
    methods: {
      addElement() {
        const element = Object.assign({}, ELEMENT, { type: 'rating' })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .rating-button {
    $amount: 2;

    .sub-content {
      height: $element-button-size * $amount;
    }
  }
</style>
