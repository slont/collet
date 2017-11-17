<template>
  <element-button class="datetime-button" icon="schedule" label="DateTime"
                  @click.native="addElement">
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
  import { ELEMENT } from '@/constant'

  export default {
    components: { ElementButton },
    data() {
      return {}
    },
    methods: {
      addElement() {
        const element = Object.assign({}, ELEMENT, { type: 'datetime' })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .datetime-button {
    $amount: 2;

    .sub-content {
      height: $element-button-size * $amount;
    }
  }
</style>
