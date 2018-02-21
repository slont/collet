<template>
  <modal id="item-create-modal" class="modal" :class="`page-${pageIndex}`" ref="itemCreateModal" @close="reset">
    <div class="modal-card-body">
      <div class="columns is-gapless">
        <div class="left-column column is-hidden-mobile">
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
          <div class="theme-dropdown dropdown">
            <div class="dropdown-trigger">
              <a class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{ theme.title }}</span>
                <span class="icon is-small"><i class="material-icons">arrow_drop_down</i></span>
              </a>
            </div>
          </div>

          <div class="template-tabs tabs is-small" v-if="templates.length">
            <ul>
              <li v-for="(template, i) in templates"
                  :class="{ 'is-active': selectedTemplateNo === i }" @click="changeTemplate(i)">
                <a><span>{{ `テンプレート ${i + 1}` }}</span></a>
              </li>
              <li :class="{ 'is-active': selectedTemplateNo === -1 }" @click="changeTemplate(-1)">
                <a><span>白紙</span></a>
              </li>
            </ul>
          </div>

          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class="field">
                  <div class="item-name control">
                    <input v-model.trim="item.name" class="input title is-3" type="text" placeholder="Item Name"
                           name="itemName"
                           v-validate="'required'" :class="{ 'is-danger': errors.has('itemName') }">
                    <span v-show="errors.has('itemName')" class="help is-danger">{{ errors.first('itemName') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div class="item-elements">
            <div v-for="(element, i) in item.elements" :key="i" class="field element-field">
              <div class="sort-buttons">
                <a class="button up-button is-white" @click="upOrder(i)"><i class="material-icons">arrow_upward</i></a>
                <span class="element-order">{{ element.order + 1 }}</span>
                <a class="button down-button is-white" @click="downOrder(i)"><i class="material-icons">arrow_downward</i></a>
              </div>

              <text-element :params="element" v-if="'text' === element.type" editable></text-element>
              <image-element :params="element" v-else-if="'image' === element.type" editable></image-element>
              <location-element :params="element" v-else-if="'location' === element.type" editable></location-element>
              <datetime-element :params="element" v-else-if="'date' === element.type" editable></datetime-element>
              <datetime-element :params="element" v-else-if="'time' === element.type" editable></datetime-element>
              <datetime-element :params="element" v-else-if="'datetime' === element.type" editable></datetime-element>
              <tag-element :params="element" v-else-if="'tag' === element.type" editable></tag-element>
              <link-element :params="element" v-else-if="'link' === element.type" editable></link-element>
              <phone-element :params="element" v-else-if="'phone' === element.type" editable></phone-element>
              <email-element :params="element" v-else-if="'email' === element.type" editable></email-element>
              <rating-element :params="element" v-else-if="'rating' === element.type" editable></rating-element>
              <switch-element :params="element" v-else-if="'switch' === element.type" editable></switch-element>

              <a @click="removeElement(i)" class="delete"></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-card-body slider is-hidden-desktop">
      <div class="buttons has-addons">
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

    <footer class="modal-card-foot has-right">
      <label class="checkbox">
        <input v-model="isTemplate" type="checkbox">
        テンプレート登録
      </label>
      <a @click="close" class="button">キャンセル</a>
      <guard-button :click="ok" class="button is-info">作成</guard-button>
    </footer>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import TemplateModel from '@/models/Template'
  import ItemModel from '@/models/Item'
  import FileModel from '@/models/File'
  import Modal from '@/components/Modal'
  import ElementButton from '@/components/element/button/ElementButton'
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
      ElementButton,
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
        draggingElement: null,
        theme: {
          id: '',
          title: '',
          templates: []
        },
        item: {
          name: '',
          elements: []
        },
        templates: [],
        selectedTemplateNo: 0,
        isTemplate: false,
        errorMessage: ''
      }
    },
    computed: {
      themeId() {
        return this.theme.id || this.$route.params.themeId
      }
    },
    methods: {
      open(theme = {}) {
        this.refresh(theme)
        this.$refs.itemCreateModal.open()
      },
      refresh(theme = {}) {
        this.theme = theme
        this.fetchThemeId().then(() => {
          return new TemplateModel(this.themeId).find({
            p: 0,
            s: 20
          })
        }).then(res => {
          if (res.data.length) {
            this.templates = res.data
            Object.assign(this.item.elements, this.templates[0].elements)
          }
        })
      },
      fetchThemeId() {
        if (this.themeId) {
          return Promise.resolve()
        } else {
          return new ThemeModel().find().then(res => {
            if (res.data.length) {
              this.theme = res.data[0]
              return Promise.resolve()
            } else {
              return Promise.reject()
            }
          })
        }
      },
      close() {
        this.reset()
        this.$refs.itemCreateModal.close()
      },
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.setOrder()
          const body = Object.assign({
            isTemplate: this.isTemplate
          }, this.item)
          await new ItemModel(this.themeId).create(body).catch(err => {
            this.errorMessage = err
          })

          this.$emit('refresh')
          this.$message({
            showClose: true,
            message: '作成されました',
            type: 'success'
          })
          this.close()
        }).catch(err => this.$message.error(err))
      },
      reset() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
      },
      changeTemplate(index) {
        this.selectedTemplateNo = index
        if (-1 === index) {
          this.item.elements = []
        } else {
          this.item.elements = this.templates[index].elements
        }
      },
      addElement(element) {
        this.item.elements.push(element)
        this.setOrder()
        this.$nextTick(() => {
          const container = this.$el.querySelector('.main-column')
          container.scrollTop = container.scrollHeight
        })
      },
      removeElement(i) {
        this.item.elements.splice(i, 1)
        this.setOrder()
      },
      setOrder() {
        let i = 0
        this.item.elements = this.item.elements.map(element => {
          element.order = i++
          return element
        })
      },
      upOrder(i) {
        const element = this.item.elements[i]
        this.item.elements.splice(i, 1, this.item.elements[i - 1])
        this.item.elements.splice(i - 1, 1, element)
        this.setOrder()
      },
      downOrder(i) {
        const element = this.item.elements[i]
        this.item.elements.splice(i, 1, this.item.elements[i + 1])
        this.item.elements.splice(i + 1, 1, element)
        this.setOrder()
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
        new FileModel().create(file, this.themeId).then(res => {
          this.item.image = res.data.path
        })
      },
      removeImage() {
        this.item.image = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #item-create-modal {
    $button-count: 9;

    > .modal-card {
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
              width: 100%;
              padding: 0;
              overflow-y: scroll;

              > .buttons {
                flex-direction: column;
                width: $element-button-size;

                .button:not(:last-child) {
                  margin-right: 0;
                  margin-bottom: -1px;
                }
                .template-button {
                  @extend .is-primary;
                }
                .subtitle {
                  margin-bottom: .5em;
                  color: grey;
                }
                .buttons-label:not(:first-child) {
                  margin-top: 1.5em;
                }
              }
            }
          }
          .main-column {
            $sort-button-size: 2rem;
            $margin-side: $sort-button-size + .5rem;
            padding: 0 0 1.5rem 3rem !important;
            background-color: white;
            overflow-y: scroll;
            z-index: 0;

            .theme-dropdown {
              width: 100%;

              .dropdown-trigger {
                width: 100%;

                .button {
                  max-width: 70%;

                  :first-child {
                    max-width: 95%;
                    overflow: hidden;
                  }
                  .icon {
                    margin-left: auto;
                  }
                }
              }
            }
            .template-tabs {
              margin-bottom: 1rem;

              ul {
                border-bottom: none;

                > a {
                  margin-top: 0;
                }
              }
            }
            .item-name {
              padding: 0;
              margin-bottom: 1rem;

              .input {
                border-top: none;
                border-right: none;
                border-left: none;
                border-bottom-width: 2px;
                border-radius: 0;
                box-shadow: none;
                height: 3rem;
                margin-bottom: 0;
                padding: 0;
                line-height: 3rem;
              }
            }
            .item-elements {
              margin-left: -$margin-side;
              margin-right: -$margin-side;

              .element-field {
                display: flex;
                align-items: center;

                .sort-buttons {
                  display: flex;
                  flex: .025;
                  flex-direction: column;

                  .button {
                    width: 2rem;
                    border: none;

                    .material-icons {
                      color: gainsboro;
                    }
                  }
                  .element-order {
                    font-size: .75em;
                    color: darkgrey;
                    text-align: center;
                  }
                }
                .cl-element {
                  flex: .9;
                  padding: 0 .5rem;
                }
                .delete {
                  flex: .05;
                }
                &:first-child {
                  .up-button {
                    visibility: hidden;
                    background-color: black;
                  }
                }
                &:last-child {
                  .down-button {
                    visibility: hidden;
                  }
                }
                &:not(:last-child) {
                  margin-bottom: .25rem;
                }
              }
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
      .modal-card-body.slider {
        height: $element-button-size + 1rem;
        width: 100%;
        margin: 0;
        padding: 0;
        border-radius: 0;
        overflow: scroll;

        .buttons {
          width: $element-button-size * $button-count;

          .el-button {
            margin-bottom: 0;
          }
        }
      }
      .modal-card-foot {
        .checkbox {
          font-size: $size-small;
          margin-right: 1rem;
        }
      }
      @media screen and (max-width: 768px) {
        .modal-card-body {
          padding-left: 0;
          padding-right: 0;

          .columns .main-column {
            margin-bottom: 1rem;
            padding: 0 2.75rem !important;

            > .dropdown,
            > .tabs,
            > .media {
              margin-left: -1.5rem;
              margin-right: -1.5rem;
            }
          }
        }
      }
    }
  }
</style>
