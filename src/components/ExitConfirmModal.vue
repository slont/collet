<template>
  <modal id="exit-confirm-modal" class="modal" ref="exitConfirmModal">
    <div class="modal-card-body">
      <div class="column">
        <div class="field">
          <div class="control">
            変更は破棄されますがよろしいですか？
          </div>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot">
      <a @click="close" class="button is-medium">キャンセル</a>
      <a @click="ok" class="ok-button button is-medium is-primary">OK</a>
    </footer>
  </modal>
</template>

<script>
  import Modal from '@/components/Modal'

  export default {
    components: { Modal },
    data() {
      return {
        next: () => {}
      }
    },
    methods: {
      open(next) {
        this.next = next
        this.$refs.exitConfirmModal.open()
      },
      close() {
        this.next(false)
        this.$refs.exitConfirmModal.close()
      },
      async ok() {
        this.next()
        this.$refs.exitConfirmModal.close()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #exit-confirm-modal {
    .modal-card {
      position: fixed;
      top: 33%;
      left: 0;
      height: initial !important;
      border-radius: 5px;

      .modal-card-body {
        max-height: 86px;
      }
      .ok-button {
        margin-left: auto;
      }
    }
  }
</style>
