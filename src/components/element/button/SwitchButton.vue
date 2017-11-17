<template>
  <element-button class="switch-button" icon="toll" label="Switch"
                  @click.native="addElement">
    <div class="buttons sub-content has-addons">
      <element-button class="photo-button" icon="photo" label="Image">
      </element-button>
      <element-button class="photo-button" icon="toll" label="Switch">
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
        const element = Object.assign({}, ELEMENT, { type: 'switch' })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .switch-button {
    $amount: 2;

    .sub-content {
      height: $element-button-size * $amount;
    }
  }
</style>
