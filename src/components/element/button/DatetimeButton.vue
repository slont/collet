<template>
  <element-button class="datetime-button" icon="schedule" label="DateTime">
    <div class="buttons sub-content has-addons">
      <element-button class="photo-button" icon="schedule" label="Date"
                      @click.native="addElement('date')">
      </element-button>
      <element-button class="photo-button" icon="schedule" label="Time"
                      @click.native="addElement('time')">
      </element-button>
      <element-button class="photo-button" icon="schedule" label="DateTime"
                      @click.native="addElement('datetime')">
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
      addElement(type) {
        const element = Object.assign({}, ELEMENT, { type: type })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .datetime-button {
    $amount: 3;

    .sub-content {
      height: $element-button-size * $amount;
    }
  }
</style>
