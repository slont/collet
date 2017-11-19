<template>
  <modal id="item-create-modal" class="modal" :class="`page-${pageIndex}`" ref="itemCreateModal" @close="reset">
    <div class="modal-card-body">
      <div class="columns is-gapless">
        <div class="left-column column">
          <div class="slider">
            <div class="buttons has-addons is-centered">
              <text-button @add="addElement"></text-button>
              <image-button @add="addElement"></image-button>
              <location-button @add="addElement"></location-button>
              <datetime-button @add="addElement"></datetime-button>
              <link-button @add="addElement"></link-button>
              <rating-button @add="addElement"></rating-button>
              <tag-button @add="addElement"></tag-button>
              <phone-button @add="addElement"></phone-button>
              <email-button @add="addElement"></email-button>
            </div>
          </div>
        </div>

        <div class="main-column column">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class="field">
                  <div class="item-name control">
                    <input v-model="item.name" class="input is-large" type="text" placeholder="Item Name" name="itemName"
                           v-validate="'required'" :class="{ 'is-danger': errors.has('itemName') }">
                    <span v-show="errors.has('itemName')" class="help is-danger">{{ errors.first('itemName') }}</span>
                  </div>
                </div>
                <div class="item-description">
                  <textarea v-model="item.description" class="textarea" rows="2" placeholder="Item Name"></textarea>
                </div>
              </div>
            </div>
          </article>

          <div v-for="(element, i) in item.elements" :key="i" class="field element-field">
            <text-element :params="element" @remove="removeElement(i)" v-if="'text' === element.type" editable></text-element>
            <image-element :params="element" @remove="removeElement(i)" v-else-if="'image' === element.type" editable></image-element>
            <location-element :params="element" @remove="removeElement(i)" v-else-if="'location' === element.type" editable></location-element>
            <datetime-element :params="element" @remove="removeElement(i)" v-else-if="'date' === element.type" editable></datetime-element>
            <datetime-element :params="element" @remove="removeElement(i)" v-else-if="'time' === element.type" editable></datetime-element>
            <datetime-element :params="element" @remove="removeElement(i)" v-else-if="'datetime' === element.type" editable></datetime-element>
            <tag-element :params="element" @remove="removeElement(i)" v-else-if="'tag' === element.type" editable></tag-element>
            <link-element :params="element" @remove="removeElement(i)" v-else-if="'link' === element.type" editable></link-element>
            <phone-element :params="element" @remove="removeElement(i)" v-else-if="'phone' === element.type" editable></phone-element>
            <email-element :params="element" @remove="removeElement(i)" v-else-if="'email' === element.type" editable></email-element>
            <rating-element :params="element" @remove="removeElement(i)" v-else-if="'rating' === element.type" editable></rating-element>
            <switch-element :params="element" @remove="removeElement(i)" v-else-if="'switch' === element.type" editable></switch-element>
          </div>
        </div>

        <div class="right-column column">
          <figure class="media-right">
            <div class="image image-field field">
              <div class="field-body">
                <div class="control">
                  <div class="file-view" v-if="item.image || item.imageBase64">
                    <img :src="item.image || item.imageBase64"/>
                    <a @click="removeImage" class="delete"></a>
                  </div>
                  <div class="file">
                    <label class="file-label">
                      <input @change="changeImage" class="file-input" type="file" name="resume">
                      <span class="file-cta">
                        <span class="file-icon"><i class="material-icons">file_upload</i></span>
                        <span class="file-label">メイン画像</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </div>

      </div>
    </div>

    <footer class="modal-card-foot has-right">
      <button @click="close" class="button">キャンセル</button>
      <button @click="ok" class="button is-primary">作成</button>
    </footer>
  </modal>
</template>

<script>
  import ItemModel from '@/models/Item'
  import Modal from '@/components/Modal'
  import TextButton from '@/components/element/button/TextButton'
  import ImageButton from '@/components/element/button/ImageButton'
  import LocationButton from '@/components/element/button/LocationButton'
  import DatetimeButton from '@/components/element/button/DatetimeButton'
  import TagButton from '@/components/element/button/TagButton'
  import LinkButton from '@/components/element/button/LinkButton'
  import PhoneButton from '@/components/element/button/PhoneButton'
  import EmailButton from '@/components/element/button/EmailButton'
  import RatingButton from '@/components/element/button/RatingButton'
  import SwitchButton from '@/components/element/button/SwitchButton'
  import TextElement from '@/components/element/TextElement'
  import ImageElement from '@/components/element/ImageElement'
  import LocationElement from '@/components/element/LocationElement'
  import DatetimeElement from '@/components/element/DatetimeElement'
  import TagElement from '@/components/element/TagElement'
  import LinkElement from '@/components/element/LinkElement'
  import PhoneElement from '@/components/element/PhoneElement'
  import EmailElement from '@/components/element/EmailElement'
  import RatingElement from '@/components/element/RatingElement'
  import SwitchElement from '@/components/element/SwitchElement'

  export default {
    components: {
      Modal,
      TextButton,
      ImageButton,
      LocationButton,
      DatetimeButton,
      TagButton,
      LinkButton,
      PhoneButton,
      EmailButton,
      RatingButton,
      SwitchButton,
      TextElement,
      ImageElement,
      LocationElement,
      DatetimeElement,
      TagElement,
      LinkElement,
      PhoneElement,
      EmailElement,
      RatingElement,
      SwitchElement
    },
    data() {
      return {
        pageIndex: 0,
        item: {
          name: '',
          description: '',
          image: '',
          imageBase64: '',
          elements: []
        },
        template: {},
        errorMessage: ''
      }
    },
    methods: {
      open(template) {
        this.template = template
        this.$refs.itemCreateModal.open()
      },
      close() {
        this.reset()
        this.$refs.itemCreateModal.close()
      },
      ok() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          new ItemModel(this.$route.params.themeId).create(this.item).then(() => {
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
      addElement(element) {
        this.item.elements.push(element)
      },
      removeElement(i) {
        this.item.elements.splice(i, 1)
      },
      changeImage(e) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.createImage(files[0])
      },
      createImage(file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.item.image = e.target.result
        }
        reader.readAsDataURL(file)
      },
      removeImage() {
        this.item.image = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #item-create-modal {
    .modal-card {
      display: flex;
      flex-direction: column;
      height: 95%;
      width: 80%;
      transition: width .3s, height .3s;

      .modal-card-body {
        height: 100%;
        padding-bottom: 0;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;

        .columns {
          height: 100%;

          .left-column {
            height: 100%;
            max-width: $element-button-size;

            .slider {
              height: 100%;
              width: $element-button-size * 2 + 1;
              padding: 0;
              overflow-y: scroll;

              > .buttons {
                flex-direction: column;
                width: $element-button-size;

                .button:not(:last-child) {
                  margin-right: 0;
                  margin-bottom: -1px;
                }
              }
            }
          }
          .main-column {
            padding: 0 1rem !important;
            background-color: white;
            z-index: 0;

            .item-name {
              padding: 0;

              .input {
                border-top: none;
                border-right: none;
                border-left: none;
                border-bottom-width: 2px;
                border-radius: 0;
                box-shadow: none;
                padding: 0;
              }
            }
            .element-field:not(:last-child) {
              margin-bottom: .25rem;
            }
          }
          .right-column {
            max-width: 256px;

            .image-field {
              .field-body {
                width: 192px;
                display: flex;
                flex-direction: column;

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
            }
          }
        }
      }
    }
  }
</style>
