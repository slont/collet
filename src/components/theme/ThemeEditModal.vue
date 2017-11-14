<template>
  <modal id="theme-edit-modal" class="modal" ref="themeEditModal" @close="reset">
    <div class="modal-card-body">
      <div class="title-field field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">タイトル</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded">
              <input v-model.trim="theme.title" class="input" type="text" placeholder="Name"
                     name="title" v-validate="'required|max:255'">
              <span v-show="errors.has('title')" class="has-text-danger">{{ errors.first('title') }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="description-field field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">説明文</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <textarea v-model="theme.description" class="textarea"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="image-field field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">イメージ</label>
        </div>
        <div class="field-body">
          <div class="upload-box file">
            <label class="file-label">
              <input @change="changeImage" class="file-input" type="file" name="resume">
              <span class="file-cta">
                  <span class="file-icon"><i class="material-icons">file_upload</i></span>
                  <span class="file-label">Choose a file…</span>
                </span>
            </label>
          </div>
          <div class="control">
            <div class="file-view" v-if="theme.image || theme.imageBase64">
              <img :src="theme.image || theme.imageBase64"/>
              <a @click="removeImage" class="delete"></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
    <footer class="modal-card-foot has-right">
      <button @click="close" class="button">キャンセル</button>
      <button @click="ok" class="button is-primary">保存</button>
    </footer>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import Modal from '@/components/Modal'

  export default {
    components: { Modal },
    data() {
      return {
        theme: {
          title: '',
          description: '',
          image: '',
          imageBase64: '',
          createdUser: this.$store.state.user
        },
        errorMessage: ''
      }
    },
    methods: {
      open(theme) {
        Object.assign(this.theme, theme)
        this.$refs.themeEditModal.open()
      },
      close() {
        this.reset()
        this.$refs.themeEditModal.close()
      },
      ok() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          new ThemeModel().update(this.theme.id, this.theme).then(() => {
            this.$emit('refresh')
            this.close()
          }).catch(err => {
            this.errorMessage = err
          })
        })
      },
      reset() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
      },
      changeImage(e) {
        this.theme.image = ''
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.createImage(files[0])
      },
      createImage(file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.theme.imageBase64 = e.target.result
        }
        reader.readAsDataURL(file)
      },
      removeImage() {
        this.theme.image = ''
        this.theme.imageBase64 = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #theme-edit-modal {
    .image-field {
      .field-body {
        display: flex;
        flex-direction: column;

        .file-view {
          .delete {
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 10;
          }
        }
      }
    }
  }
</style>
