<template>
  <modal id="edit-item" class="modal" ref="editItem">
    <header class="modal-card-head">
      <span class="back-button icon" @click="$router.go(-1)">
        <i class="material-icons">arrow_back</i>
      </span>

      <span class="modal-card-title title is-5">カレット編集</span>

      <label class="checkbox">
        <input v-model="isTemplate" type="checkbox">
        テンプレート登録
      </label>

      <guard-button :click="save" class="ok-button is-success is-inverted is-outlined">
        <span class="icon"><i class="material-icons">check</i></span>
      </guard-button>
    </header>

    <div class="modal-card-body">
      <div class="columns is-gapless">
        <div class="main-column column">
          <div class="theme-field field">
            <div class="subtitle is-7">テーマ</div>
            <div class="control">
              <div class="theme-dropdown dropdown">
                <div class="dropdown-trigger">
                  <a class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>{{ theme.title }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class="field">
                  <div class="item-name control">
                    <input v-model.trim="item.name" class="input title is-3" type="text" placeholder="Cullet Name"
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

    <footer class="modal-card-foot slider">
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
    </footer>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
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
        themes: [],
        templates: [],
        selectedTemplateNo: 0,
        isTemplate: false,
        errorMessage: ''
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      themeId() {
        return this.$route.params.themeId
      },
      itemId() {
        return this.$route.params.itemId
      }
    },
    created() {
      this.refresh().then(() => this.$refs.editItem.open())
    },
    methods: {
      async refresh() {
        new ThemeModel().findOne(this.themeId).then(res => {
          this.theme = res.data
        })

        await new ItemModel(this.themeId).findOne(this.itemId).then(res => {
          this.item = res.data
          this.$refs.editItem.open()
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      close() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
        this.$refs.createItem.close()
      },
      async save() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.setOrder()
          const body = Object.assign({
            isTemplate: this.isTemplate
          }, this.item)
          await new ItemModel(this.theme.id).update(this.item.id, body).catch(err => {
            this.errorMessage = err
          })

          this.$message({
            showClose: true,
            message: '更新されました',
            type: 'success'
          })
          this.$router.go(-1)
        }).catch(err => this.$message.error(err))
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
  #edit-item {
    $button-count: 9;

    > .modal-card {
      display: flex;
      flex-direction: column;
      height: 95%;
      width: 80%;
      transition: width .3s, height .3s;

      .modal-card-head,
      .modal-card-foot {
        border-radius: 0;
      }
      .modal-card-head {
        height: $header-nav-height;
        padding: 15px;
        color: white;
        background-color: $main-color;

        .back-button {
          margin-right: 1rem;
        }
        .modal-card-title {
          margin-bottom: 0;
        }
        .checkbox {
          font-size: $size-7;
          align-items: center;
          display: flex;
          margin-right: 1em;
        }
        .ok-button {
          border: none;
        }
      }
      > .modal-card-body {
        height: 100%;
        padding: .5rem 0;

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
            height: 100%;
            padding: 0 3rem 1rem !important;
            background-color: white;
            overflow-y: scroll;
            z-index: 0;

            .theme-field {
              margin: 0 -2rem;

              .subtitle {
                margin-bottom: 0;
              }
              .theme-dropdown {
                width: 100%;

                .dropdown-trigger {
                  width: 100%;

                  .button {
                    max-width: 70%;
                    min-width: 300px;
                    padding: 0;
                    border-top: none;
                    border-left: none;
                    border-right: none;

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
            }
            .template-tabs {
              margin: 0 -2rem 1rem;

              ul {
                border-bottom: none;

                > a {
                  margin-top: 0;
                }
              }
            }
            .media {
              margin: 0 -2rem;
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
      .modal-card-foot.slider {
        height: $element-button-size;
        width: 100%;
        margin: 0;
        padding: 0;
        border-radius: 0;
        overflow: scroll;

        .buttons {
          width: $element-button-size * $button-count;
          min-width: $element-button-size * $button-count;
          margin-bottom: 0;

          .button {
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
    }
  }
</style>
