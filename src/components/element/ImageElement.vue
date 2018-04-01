<template>
  <cl-element class="image-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">photo</i>
    </span>
    <div class="control file" v-if="editable">
      <div class="field image-field">
        <div class="control loading-mask" :class="{ 'is-loading': params.valueStr.substring(0, 4) === 'data' }">
          <div class="file is-boxed">
            <label class="file-label">
              <input @change="changeImage" class="file-input" type="file" name="resume"
                     @focus="$emit('focus')" @blur="$emit('blur')">
              <span class="file-view" v-if="params.valueStr">
                <img :src="params.valueStr"/>
                <a @click.stop.prevent="removeImage" class="delete"></a>
              </span>
              <span class="file-cta" v-else>
                <span class="file-icon"><i class="material-icons">file_upload</i></span>
                <span class="file-label">Upload Image</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <figure class="image file-view" v-else>
      <img :src="params.valueStr"/>
    </figure>
  </cl-element>
</template>

<script>
  import loadImage from 'blueimp-load-image'
  import FileModel from '@/models/File'
  import ClElement from './ClElement'

  export default {
    components: { ClElement },
    props: {
      params: {
        type: Object,
        default: {
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        }
      },
      editable: Boolean
    },
    methods: {
      changeImage(e) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.createImage(files[0])
      },
      removeImage() {
        this.params.valueStr = ''
      },
      createImage(file) {
        loadImage.parseMetaData(file, (data) => {
          const options = {
            orientation: null,
            canvas: true
          }
          if (data.exif) {
            options.orientation = data.exif.get('Orientation')
          }
          this.getDataUrl(file, options).then(result => {
            this.params.valueStr = result
            const block = result.split(';')
            const realData = block[1].split(',')[1]
            const blob = this.b64toBlob(realData)
            new FileModel().create(blob).then(res => {
              this.params.valueStr = res.data.path
            })
          })
        })
      },
      getDataUrl(blobImage, options) {
        return new Promise(resolve => {
          loadImage(blobImage, canvas => {
            resolve(canvas.toDataURL(blobImage.type))
          }, options)
        })
      },
      b64toBlob(b64Data, sliceSize = 512) {
        const byteCharacters = atob(b64Data)
        const byteArrays = []

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        return new Blob(byteArrays)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .image-element {
    .file-view {
      margin-top: 0 !important;
      text-align: center;

      .delete {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 10;
      }
      + .file {
        position: absolute;
        top: 0;
        opacity: .7;
      }
      img {
        width: 70%;
        margin: 0 auto;
      }
    }
  }
</style>
