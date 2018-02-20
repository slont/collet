<template>
  <div class="modal" :class="{ 'is-active': active }">
    <div @click="close" class="modal-background"></div>
    <div class="modal-card">
      <slot></slot>
    </div>
    <button @click="close" class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: false
      }
    },
    methods: {
      open() {
        this.active = true
      },
      close() {
        this.$emit('close')
        this.active = false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .modal {
    .modal-card-head {
      background: white;
    }
    .modal-card-foot {
      background: white;
      height: 4rem;
    }

    @media screen and (max-width: 768px) {
      .modal-card {
        height: 100vh !important;
        width: 100vw !important;
        max-height: 100vh;
        margin: 0;
      }
    }
  }
</style>
