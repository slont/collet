<template>
  <modal id="item-edit-modal" class="modal" :class="`page-${pageIndex}`" ref="itemEditModal" @close="reset">
    <header class="action-modal-header modal-card-head">
      <span class="modal-card-title title is-6 has-text-white">カレット編集</span>
    </header>

    <div class="modal-card-body">
      <div class="columns is-gapless">
        <div class="left-column column">
          <div class="slider">
            <cl-buttons @add="addElement" class="is-centered"/>
          </div>
        </div>

        <div class="main-column column">
          <div class="theme-dropdown dropdown is-primary">
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
                <b-icon icon="arrow-up" @click.native="upOrder(i)"/>
                <span class="element-order">{{ element.order + 1 }}</span>
                <b-icon icon="arrow-down" @click.native="downOrder(i)"/>
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

              <b-icon pack="far" icon="times-circle" class="delete-icon is-small has-text-danger"
                      @click.native="removeElement(i)"/>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right">
      <a @click="$refs.itemDeleteModal.open(item)" class="button is-danger is-outlined is-left">削除</a>

      <b-checkbox v-model="isTemplate">
        テンプレート登録
      </b-checkbox>
      <a @click="close" class="button">キャンセル</a>
      <guard-button :click="ok" class="is-info">保存</guard-button>
    </footer>

    <theme-select-modal ref="themeSelectModal" @refresh="refreshTheme"/>
    <item-delete-modal ref="itemDeleteModal" @refresh="refreshClose"/>
  </modal>
</template>

<script>
  import ItemModel from '@/models/Item'
  import Modal from '@/components/Modal'
  import ThemeSelectModal from '@/components/theme/ThemeSelectModal'
  import ClButtons from '@/components/element/button/ClButtons'
  import TextElement from '@/components/element/TextElement'
  import ImageElement from '@/components/element/ImageElement'
  import LocationElement from '@/components/element/LocationElement'
  import TwitterElement from '@/components/element/TwitterElement'
  import InstagramElement from '@/components/element/InstagramElement'
  import DatetimeElement from '@/components/element/DatetimeElement'
  import TagElement from '@/components/element/TagElement'
  import LinkElement from '@/components/element/LinkElement'
  import PhoneElement from '@/components/element/PhoneElement'
  import EmailElement from '@/components/element/EmailElement'
  import RatingElement from '@/components/element/RatingElement'
  import SwitchElement from '@/components/element/SwitchElement'
  import ItemDeleteModal from './ItemDeleteModal'

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
      SwitchElement,
      ItemDeleteModal
    },
    data() {
      return {
        pageIndex: 0,
        draggingElement: null,
        theme: {
          id: '',
          title: ''
        },
        item: {
          name: '',
          description: '',
          image: '',
          elements: []
        },
        templates: [],
        isTemplate: false,
        errorMessage: ''
      }
    },
    computed: {
      themeId: ({$route}) => $route.params.themeId
    },
    methods: {
      open(theme, item) {
        this.theme = theme
        this.item = item
        new ItemModel(theme.id).findOne(this.item.id).then(res => {
          const item = res.data
          item.elements.forEach(e => {
            e.orderId = e.order
          })
          this.item = item
          this.$refs.itemEditModal.open()
        }).catch(err => {
          console.log(err)
          this.$toast.open({
            message: `データ取得に失敗しました`,
            type: 'is-danger'
          })
        })
      },
      async refreshTheme(theme) {
        this.theme = theme
      },
      close() {
        this.reset()
        this.$refs.itemEditModal.close()
      },
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.setOrder()
          const body = Object.assign({
            isTemplate: this.isTemplate
          }, this.item)
          await new ItemModel(this.themeId).update(this.item.id, body).catch(err => {
            this.errorMessage = err
          })

          this.$emit('refresh')
          this.$toast.open({
            message: '保存されました',
            type: 'is-success'
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
  #item-edit-modal {
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
          .is-left {
            margin-right: auto;
          }
          .checkbox {
            margin-right: .5rem;
          }
        }
      }
    }
  }
</style>
