<template>
  <b-modal :active.sync="active" scroll="keep" has-modal-card @close="close">
    <div class="modal-card">
      <slot></slot>
    </div>
  </b-modal>
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
        this.$store.commit('SET_MODAL_ACTIVE', true)
      },
      close() {
        this.$emit('close')
        this.active = false
        this.$store.commit('SET_MODAL_ACTIVE', false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .modal {
    .modal-close {
      display: none;
    }
    > .animation-content {
      > .modal-card {
        .modal-card-head {
          height: 2.75rem;
          border: none;
          background-color: $main-color;
          color: white;

          .b-checkbox {
            margin-right: .5rem;
          }
          .back-button {
            margin-right: .5em;
          }
          .title {
            margin-bottom: 0;
          }
          .button {
            border: none;
          }
          :last-child {
            padding-right: .25rem;
          }
        }
        .modal-card-foot {
          background: white;
          height: 3.25rem;
        }
      }

      @media screen and (max-width: 768px) {
        > .modal-card {
          height: 100vh;
          width: 100vw;
          max-height: 100%;
          margin: 0;

          .modal-card-head,
          .modal-card-foot {
            border-radius: 0;
          }
        }
        .modal-close:before,
        .modal-close:after{
          background-color: $label-color;
        }
      }
    }
  }
</style>
