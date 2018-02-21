<template>
  <modal id="item-delete-modal" class="modal" ref="itemDeleteModal" @close="reset">
    <div class="modal-card-body">
      <div class="column">
        <div class="field">
          <label class="label">アイテム名</label>
          <div class="control">
            {{ item.name }}
          </div>
        </div>

        <div class="field">
          <div class="control is-danger">
            本当に削除しますか？
          </div>
        </div>
      </div>
    </div>

    <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
    <footer class="modal-card-foot has-right">
      <guard-button :click="ok" class="button is-danger">削除</guard-button>
      <a @click="close" class="button">キャンセル</a>
    </footer>
  </modal>
</template>

<script>
  import ItemModel from '@/models/Item'
  import Modal from '@/components/Modal'

  export default {
    components: { Modal },
    data() {
      return {
        item: {
          id: '',
          name: ''
        },
        errorMessage: ''
      }
    },
    methods: {
      open(item) {
        this.item = item
        this.$refs.itemDeleteModal.open()
      },
      close() {
        this.reset()
        this.$refs.itemDeleteModal.close()
      },
      async ok() {
        await new ItemModel().delete(this.item.id).then(() => {
          this.$emit('refresh')
          this.$message({
            showClose: true,
            message: '削除されました',
            type: 'success'
          })
          this.close()
        }).catch(err => {
          this.errorMessage = err
        })
      },
      reset() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #item-delete-modal {
    .modal-card-body {
      .is-danger {
        color: $danger;
      }
    }
  }
</style>
