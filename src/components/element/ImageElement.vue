<template>
  <cl-element class="image-element" :params="params" :editable="editable">
    <p class="control file" v-if="editable">
      <label class="file-label">
        <input @change="changeImage" class="file-input" type="file" name="resume">
        <span class="file-cta">
          <span class="file-icon"><i class="material-icons">file_upload</i></span>
          <span class="file-label">Choose a file…</span>
        </span>
      </label>
    </p>

    <div class="file-view" v-if="!editable && (item.image || item.imageBase64)">
      <img :src="item.image || item.imageBase64"/>
      <a @click="removeImage" class="delete"></a>
    </div>
  </cl-element>
</template>

<script>
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
    data() {
      return {
        imageBase64: ''
      }
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
          this.imageBase64 = e.target.result
        }
        reader.readAsDataURL(file)
      },
      removeImage() {
        this.value.valueStr = ''
        this.imageBase64 = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .image-element {
  }
</style>
