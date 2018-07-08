<template>
  <modal id="item-create-modal" class="modal" :class="`page-${pageIndex}`" ref="itemCreateModal" @close="reset">
    <header class="action-modal-header modal-card-head">
      <span class="modal-card-title title is-6 has-text-white">カレット作成</span>
    </header>

    <div class="modal-card-body">
      <div class="columns is-gapless">
        <div class="left-column column">
          <div class="slider">
            <cl-buttons @add="addElement" class="is-centered"/>
          </div>
        </div>

        <div class="main-column column">
          <div class="theme-dropdown dropdown">
            <div class="dropdown-trigger" @click.stop="$refs.themeSelectModal.open(theme)">
              <a class="button is-small text-color-base fullwidth">
                <span>{{ theme.title }}</span>
                <b-icon icon="chevron-down" size="is-small"/>
              </a>
            </div>
          </div>

          <div class="item-name-content content">
            <div class="field">
              <div class="item-name control">
                <input v-model.trim="item.name" class="input title is-4 is-primary text-color-main" type="text" placeholder="Cullet Name"
                       name="culletName" v-validate="'required'" :class="{ 'is-danger': errors.has('culletName') }">
                <span v-show="errors.has('culletName')" class="help is-danger">{{ errors.first('culletName') }}</span>
              </div>
            </div>
          </div>

          <transition-group tag="div" name="element-list" class="item-elements">
            <div v-for="(element, i) in item.elements" :key="element.orderId" class="field element-field flexbox">
              <div class="sort-buttons flexbox">
                <b-icon icon="arrow-up" class="clickable" @click.native="upOrder(i)"/>
                <span class="element-order">{{ element.order + 1 }}</span>
                <b-icon icon="arrow-down" class="clickable" @click.native="downOrder(i)"/>
              </div>

              <text-element :params="element" v-if="'text' === element.type" editable/>
              <image-element :params="element" v-else-if="'image' === element.type" editable/>
              <location-element :params="element" v-else-if="'location' === element.type" editable/>
              <twitter-element :params="element" v-else-if="'twitter' === element.type" editable/>
              <instagram-element :params="element" v-else-if="'instagram' === element.type" editable/>
              <datetime-element :params="element" v-else-if="'date' === element.type" editable/>
              <datetime-element :params="element" v-else-if="'time' === element.type" editable/>
              <datetime-element :params="element" v-else-if="'datetime' === element.type" editable/>
              <tag-element :params="element" v-else-if="'tag' === element.type" editable/>
              <link-element :params="element" v-else-if="'link' === element.type" editable/>
              <phone-element :params="element" v-else-if="'phone' === element.type" editable/>
              <email-element :params="element" v-else-if="'email' === element.type" editable/>
              <rating-element :params="element" v-else-if="'rating' === element.type" editable/>
              <switch-element :params="element" v-else-if="'switch' === element.type" editable/>

              <b-icon pack="far" icon="times-circle" class="delete-icon is-small has-text-danger clickable"
                      @click.native="removeElement(i)"/>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right">
      <b-checkbox v-model="isTemplate">
        テンプレート登録
      </b-checkbox>
      <a @click="close" class="button">キャンセル</a>
      <guard-button :click="ok" class="is-info">作成</guard-button>
    </footer>

    <theme-select-modal ref="themeSelectModal" @refresh="refresh"/>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import TemplateModel from '@/models/Template'
  import ItemModel from '@/models/Item'
  import Modal from '@/components/Modal'
  import ThemeSelectModal from '@/components/theme/ThemeSelectModal'
  import ClButtons from '@/components/element/button/ClButtons'
  import TextElement from '@/components/element/TextElement'
  import InstagramElement from '@/components/element/InstagramElement'
  import ImageElement from '@/components/element/ImageElement'
  import LocationElement from '@/components/element/LocationElement'
  import TwitterElement from '@/components/element/TwitterElement'
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
      ThemeSelectModal,
      ClButtons,
      TextElement,
      ImageElement,
      LocationElement,
      TwitterElement,
      InstagramElement,
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
      themeId: ({$route}) => $route.params.themeId
    },
    methods: {
      open() {
        if (this.$store.state.theme.id) {
          Object.assign(this.theme, ThemeModel._deserialize(this.$store.state.theme))
          if (this.$store.state.theme.templates[0] && this.$store.state.theme.templates[0].elements.length) {
            this.item.elements = this.$store.state.theme.templates[0].elements.map(e => {
              e.orderId = e.order
              return e
            })
          }
        }
        this.refresh(this.$store.state.theme)
        this.$refs.itemCreateModal.open()
      },
      refresh(theme = {}) {
        if (theme.id) {
          this.theme = theme
        } else {
          new ThemeModel().findOne(this.themeId).then(res => {
            this.theme = res.data
          })
        }

        const themeId = theme.id || this.themeId
        new TemplateModel(themeId).find({
          p: 1,
          s: 20
        }).then(res => {
          if (res.data.length) {
            this.templates = res.data
            this.item.elements = this.templates[0].elements.map(e => {
              e.orderId = e.order
              return e
            })
          } else {
            this.templates = []
            this.item.elements = []
          }
        })
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
          this.$toast.open({
            message: '作成されました',
            type: 'is-success'
          })
          this.close()
        }).catch(err => this.$toast.open({
          message: err,
          type: 'is-danger'
        }))
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
        this.item.elements.push(Object.assign(element, {
          orderId: `${this.item.elements.length}-${new Date().getTime()}`
        }))
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #item-create-modal {
    $button-count: 8;

    > .animation-content {
      > .modal-card {
        .modal-card-body {
          .columns {
            .left-column {
              height: 100%;
              max-width: calc(#{$element-button-size} + 1rem);

              .slider {
                height: 100%;
                width: 100%;
                padding: 0;
                overflow-y: scroll;
                -webkit-overflow-scrolling : touch;

                > .buttons {
                  flex-direction: column;
                  width: $element-button-size;

                  .button:not(:last-child) {
                    margin-right: 0;
                    margin-bottom: -1px;
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
              background-color: white;
              overflow-y: scroll;
              -webkit-overflow-scrolling : touch;
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
                  height: $size-2;
                  margin-bottom: 0;
                  padding: 0;
                  line-height: $size-2;

                  &::placeholder {
                    color: rgba($primary, .25);
                  }
                }
              }
              .item-elements {
                .element-field {
                  justify-content: center;
                  min-height: 78px;

                  .sort-buttons {
                    flex-direction: column;

                    .icon {
                      margin: .25rem;
                      color: gainsboro;
                    }
                    .element-order {
                      color: darkgrey;
                      text-align: center;
                    }
                  }
                  .cl-element {
                    flex: 1;
                    padding: 0 .25rem;
                  }
                  .delete-icon {
                    margin: 0 .25rem;
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
                }
              }
            }
          }
        }
        .modal-card-foot {
          .checkbox {
            margin-right: .5rem;
          }
        }
      }
    }
  }
</style>
