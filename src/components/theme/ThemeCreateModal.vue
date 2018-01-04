<template>
  <modal id="theme-create-modal" class="modal" ref="themeCreateModal" @close="reset">
    <div class="modal-card-body columns">
      <div class="column">
        <div class="field">
          <label class="label">タイトル</label>
          <div class="control">
            <input v-model.trim="theme.title" class="input" type="text" placeholder="タイトル"
                   name="title" :class="{ 'is-danger': errors.has('title') }" v-validate="'required|max:255'">
            <span v-show="errors.has('title')" class="help is-danger">{{ errors.first('title') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">説明文</label>
          <div class="control">
            <textarea v-model="theme.description" v-autosize="theme.description" class="textarea" rows="2" placeholder="説明文"></textarea>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="field tags-field">
          <label class="label">タグ</label>
          <div class="control loading-mask" :class="{ 'is-loading': theme.image.substring(0, 4) === 'data' }">
            <el-select
                v-model="theme.tags"
                multiple
                filterable
                allow-create
                default-first-option
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                placeholder="Choose tags for your article">
              <el-option
                  v-for="item in suggests"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="field image-field">
          <label class="label">メイン画像（オプショナル）</label>
          <div class="control loading-mask" :class="{ 'is-loading': theme.image.substring(0, 4) === 'data' }">
            <div class="file is-boxed">
              <label class="file-label">
                <input @change="changeImage" class="file-input" type="file" name="resume">
                <span class="file-view" v-if="theme.image">
                  <img :src="theme.image"/>
                  <a @click.stop.prevent="removeImage" class="delete"></a>
                </span>
                <span class="file-cta" v-else>
                  <span class="file-icon"><i class="material-icons">file_upload</i></span>
                  <span class="file-label">Upload Image...</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right">
      <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
      <button @click="close" class="button">キャンセル</button>
      <button @click="ok" class="button is-info">作成</button>
    </footer>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import FileModel from '@/models/File'
  import Modal from '@/components/Modal'

  export default {
    components: { Modal },
    data() {
      return {
        theme: {
          title: '',
          description: '',
          image: '',
          tags: [],
          createdUser: this.$store.state.user
        },
        suggests: [],
        loading: false,
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
            this.$message({
              showClose: true,
              message: '作成されました',
              type: 'success'
            })
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
      refreshClose() {
        this.$emit('refresh')
        this.close()
      },
      remoteMethod(query) {
        if ('' !== query) {
          this.suggests = [
            query,
            query.substring(0, 1).toUpperCase() + query.substring(1),
            query.toUpperCase()
          ]
        } else {
          this.suggests = []
        }
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
        new FileModel().create(file).then(res => {
          this.theme.image = res.path
        })
      },
      removeImage() {
        this.theme.image = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #theme-create-modal {
    > .modal-card {
      .modal-card-body {
        margin-bottom: 0;
        padding-bottom: 0;

        .image-field {
          .control {
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
        .tags-field {
          .el-select {
            width: 100%;

            .el-tag {
              @extend .tag;
              @extend .is-primary;
            }
            .el-tag__close.el-icon-close {
              background-color: transparent;
            }
          }
        }
      }
    }
  }
</style>
