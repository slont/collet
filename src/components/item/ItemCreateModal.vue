<template>
  <modal id="item-create-modal" class="modal" :class="`page-${pageIndex}`" ref="itemCreateModal" @close="reset">
    <div class="modal-card-body">
      <div class="title-field field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">タイトル</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded">
              <input v-model.trim="item.title" class="input" type="text" placeholder="Name"
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
              <textarea v-model="item.description" class="textarea"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slider">
      <div class="buttons has-addons is-centered">
        <text-button></text-button>
        <image-button></image-button>
        <location-button></location-button>
        <datetime-button></datetime-button>
        <list-button></list-button>
        <link-button></link-button>
        <rating-button></rating-button>
        <tag-button></tag-button>
        <phone-button></phone-button>
        <email-button></email-button>
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
  import ListButton from '@/components/element/button/ListButton'
  import TagButton from '@/components/element/button/TagButton'
  import LinkButton from '@/components/element/button/LinkButton'
  import PhoneButton from '@/components/element/button/PhoneButton'
  import EmailButton from '@/components/element/button/EmailButton'
  import RatingButton from '@/components/element/button/RatingButton'

  export default {
    components: {
      Modal,
      TextButton,
      ImageButton,
      LocationButton,
      DatetimeButton,
      ListButton,
      TagButton,
      LinkButton,
      PhoneButton,
      EmailButton,
      RatingButton
    },
    data() {
      return {
        pageIndex: 0,
        item: {
          title: '',
          description: '',
          image: '',
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

          new ItemModel().create(this.item).then(() => {
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
    $width: 800px;

    .modal-card {
      display: flex;
      flex-direction: column;
      height: 95%;
      width: $width;
      transition: width .3s, height .3s;
    }
    .slider {
      $button-amount: 10;
      $size: 4.5rem;
      position: absolute;
      bottom: calc(4rem - 1px);
      height: $size * 2;
      width: 100%;
      margin-top: auto;
      padding: 0;
      border-radius: 0;
      overflow-x: scroll;

      .buttons {
        position: absolute;
        bottom: 0;
        float: left;
        width: $size * $button-amount;

        .labeled-icon-button {
          position: relative;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: $size;
          width: $size;

          .material-icons {
            font-size: 2rem;
            height: 2.4rem;
            line-height: 2.4rem;
          }
          .label {
            font-size: .75rem;
          }
          .sub-content {
            position: absolute;
            top: -$size;
            height: $size;
            display: none;
          }
        }
      }
    }
  }
</style>
