<template>
  <modal id="theme-create-modal" class="modal" ref="themeCreateModal" @close="reset">
    <header class="action-modal-header modal-card-head">
      <span class="back-button icon is-size-3" @click="close">
        <i class="material-icons">arrow_back</i>
      </span>

      <span class="modal-card-title title is-6 has-text-white">テーマ作成</span>

      <guard-button :click="ok" class="ok-button is-success is-inverted is-outlined is-size-5"
                    v-if="!loading">
        作成
      </guard-button>
    </header>

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
          <div class="control loading-mask" :class="{ 'is-loading': loading }">
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

          <div class="control flexbox">
            <el-tag v-for="(tag, i) in theme.tags" :key="tag" type="warning" closable
                    @close="$delete(theme.tags, i)">{{ tag }}</el-tag>
            <input v-model="inputVal" class="input-new-tag input"
                   @keyup.enter="confirmInput" @focus="$emit('focus')" @blur="onBlur"/>
          </div>
        </div>

        <div class="field tags-field">
          <label class="label">公開設定</label>
          <div class="control">
            <el-switch v-model="theme.private" active-color="#ff4949" inactive-color="#409eff"
                active-text="非公開"
                inactive-text="公開">
            </el-switch>
          </div>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right is-hidden-touch">
      <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
      <a @click="close" class="button">キャンセル</a>
      <guard-button :click="ok" class="is-info" :disabled="loading">作成</guard-button>
    </footer>
  </modal>
</template>

<script>
  import loadImage from 'blueimp-load-image'
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
          private: false,
          tags: [],
          createdUser: this.$store.state.user
        },
        suggests: [],
        inputVal: '',
        errorMessage: ''
      }
    },
    computed: {
      loading() {
        return /^data:.+/.test(this.theme.image)
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
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          await new ThemeModel().create(Object.assign({}, this.theme, {
            private: false === this.theme.private ? 0 : 1
          })).catch(err => {
            this.errorMessage = err
          })

          this.$emit('refresh')
          this.$message({
            showClose: true,
            message: '作成されました',
            type: 'success'
          })
          this.close()
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
        const file = files[0]

        loadImage.parseMetaData(file, data => {
          const options = {
            orientation: null,
            canvas: true
          }
          if (data.exif) {
            options.orientation = data.exif.get('Orientation')
          }
          loadImage(file, canvas => {
            this.theme.image = canvas.toDataURL(file.type)
            let _canvas = null
            if (1080 < canvas.width) {
              const ratio = canvas.height / canvas.width
              const oc = document.createElement('canvas')
              const octx = oc.getContext('2d')
              oc.width = 1080
              oc.height = 1080 * ratio
              octx.drawImage(canvas, 0, 0, oc.width, oc.height)
              _canvas = oc
            } else {
              _canvas = canvas
            }
            // upload
            _canvas.toBlob(blob => {
              new FileModel().create(blob, file.name).then(res => {
                this.theme.image = res.data.path
              })
            }, file.type)
          }, options)
        })
      },
      removeImage() {
        this.theme.image = ''
      },
      confirmInput() {
        const inputVal = this.inputVal
        if (inputVal) {
          this.theme.tags.push(inputVal)
        }
        this.inputVal = ''
      },
      onBlur() {
        this.confirmInput()
        this.$emit('blur')
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
          .control {
            flex-wrap: wrap;
            margin-bottom: 0;

            .input-new-tag {
              margin-left: .5rem;
              width: auto;
            }
          }
        }
      }
    }
  }
</style>
