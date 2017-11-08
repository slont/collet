<template>
  <modal id="theme-create-modal" class="modal" ref="themeCreateModal" @close="reset">
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
        <div class="field">
          <div class="control">
            <div class="file has-name">
              <label class="file-label">
                <input @change="changeImage" class="file-input" type="file">
                <span class="file-cta">
                  <span class="file-icon"><i class="fa fa-upload"></i></span>
                  <span class="file-label">Choose a file…</span>
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div class="file-view" v-if="theme.image">
              <img :src="theme.image"/>
              <a @click="removeImage" class="delete"></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="actions-field field is-horizontal">
      <div class="field-label is-normal"></div>
      <div class="field-body">
        <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
        <div class="field">
          <div class="control buttons has-right">
            <button @click="close" class="button">キャンセル</button>
            <button @click="ok" class="button is-primary">作成</button>
          </div>
        </div>
      </div>
    </div>
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
          image: ''
        },
        errorMessage: ''
      }
    },
    methods: {
      open() {
        this.$refs.themeCreateModal.open()
      },
      close() {
        this.reset()
        this.$refs.themeCreateModal.close()
      },
      ok() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          new ThemeModel().create(this.theme).then(() => {
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
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.createImage(files[0])
      },
      createImage(file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.theme.image = e.target.result
        }
        reader.readAsDataURL(file)
      },
      removeImage() {
        this.theme.image = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #theme-create-modal {
    .image-field {
      .file-view {
        .delete {
          position: absolute;
          top: 5px;
          right: 5px;
          opacity: 0;
        }
        &:hover {
          .delete {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
