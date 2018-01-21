<template>
  <modal id="theme-edit-modal" class="modal" ref="themeEditModal" @close="reset">
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
        <div class="field image-field">
          <label class="label">メイン画像（オプショナル）</label>
          <div class="control">
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

        <div class="field tags-field">
          <label class="label">タグ</label>
          <div class="control loading-mask" :class="{ 'is-loading': theme.image.substring(0, 4) === 'data' }">
            <el-select
                v-model="tags"
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

        <div class="field tags-field">
          <div class="control">
            <label class="label">公開設定</label>
            <el-switch v-model="theme.private" active-color="#ff4949" inactive-color="#409eff"
                active-text="非公開"
                inactive-text="公開">
            </el-switch>
          </div>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right">
      <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
      <button @click="$refs.themeDeleteModal.open(theme)" class="button is-danger is-outlined is-left">削除</button>
      <button @click="close" class="button">キャンセル</button>
      <button @click="ok" class="button is-info">保存</button>
    </footer>

    <theme-delete-modal ref="themeDeleteModal" @refresh="refreshClose"></theme-delete-modal>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import FileModel from '@/models/File'
  import Modal from '@/components/Modal'
  import ThemeDeleteModal from './ThemeDeleteModal'

  export default {
    components: { Modal, ThemeDeleteModal },
    data() {
      return {
        theme: {
          title: '',
          description: '',
          image: '',
          private: false,
          tags: [],
          createdUser: this.$store.state.user
        },
        tags: [],
        errorMessage: '',
        loading: false,
        suggests: []
      }
    },
    methods: {
      open(theme) {
        Object.assign(this.theme, theme)
        this.tags = theme.tags.map(tag => tag.name)
        this.$refs.themeEditModal.open()
      },
      close() {
        this.reset()
        this.$refs.themeEditModal.close()
      },
      ok() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          const body = Object.assign({}, this.theme, {
            tags: this.tags
          })
          new ThemeModel().update(this.theme.id, body).then(() => {
            this.$emit('refresh')
            this.$message({
              showClose: true,
              message: '保存されました',
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
        this.theme.image = ''
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
  #theme-edit-modal {
    > .modal-card {
      .modal-card-body {
        margin-bottom: 0;
        padding-bottom: 0;

        .image-field {
          .file-view {
            .delete {
              position: absolute;
              top: 5px;
              right: 5px;
              z-index: 10;
            }
          }
        }
        .tags-field {
          .el-select {
            width: 100%;

            .el-tag {
              @extend .tag;
              @extend .is-primary;

              &:before {
                content: '#';
              }
            }
            .el-tag__close.el-icon-close {
              background-color: transparent;
            }
          }
        }
      }
      .modal-card-foot {
        .is-left {
          margin-right: auto;
        }
      }
    }
  }
</style>
