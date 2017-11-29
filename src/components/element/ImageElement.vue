<template>
  <cl-element class="image-element" :params="params"
              @remove="$emit('remove')" :editable="editable">
    <p class="control file" v-if="editable">
    <div class="field image-field">
      <div class="control loading-mask" :class="{ 'is-loading': params.valueStr.substring(0, 4) === 'data' }">
        <div class="file is-boxed">
          <label class="file-label">
            <input @change="changeImage" class="file-input" type="file" name="resume">
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

    <div class="file-view" v-if="!editable && params.valueStr">
      <img :src="params.valueStr"/>
    </div>
  </cl-element>
</template>

<script>
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
      createImage(file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.params.valueStr = e.target.result
        }
        reader.readAsDataURL(file)
        new FileModel().create(file).then(res => {
          this.params.valueStr = res.path
        })
      },
      removeImage() {
        this.params.valueStr = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .image-element {
    .file-view {
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
    }
  }
</style>
