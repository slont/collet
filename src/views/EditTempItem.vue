<template>
  <modal id="edit-temp-item" class="modal" ref="editTempItem">
    <header class="action-modal-header modal-card-head">
      <span class="back-button icon is-size-3" @click="$router.go(-1)">
        <i class="material-icons">arrow_back</i>
      </span>

      <span class="modal-card-title title is-6 has-text-white">カレット編集</span>

      <guard-button :click="save" class="ok-button is-success is-inverted is-outlined is-size-5">
        保存
      </guard-button>
    </header>

    <div class="modal-card-body">
      <div class="item-name-content content">
        <div class="field">
          <div class="item-name control">
            <input v-model.trim="item.name" class="input title is-4 is-primary text-color-main" type="text" placeholder="Cullet Name"
                   @focus="onFocusInput" @blur="onBlurInput">
          </div>
        </div>
      </div>

      <div class="item-elements">
        <div v-for="(element, i) in item.elements" :key="i" class="field element-field flexbox">
          <div class="sort-buttons flexbox">
            <a class="button up-button is-white" @click="upOrder(i)"><i class="material-icons">arrow_upward</i></a>
            <span class="element-order">{{ element.order + 1 }}</span>
            <a class="button down-button is-white" @click="downOrder(i)"><i class="material-icons">arrow_downward</i></a>
          </div>

          <text-element :params="element" v-if="'text' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <image-element :params="element" v-else-if="'image' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <location-element :params="element" v-else-if="'location' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <twitter-element :params="element" v-else-if="'twitter' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <instagram-element :params="element" v-else-if="'instagram' === element.type" editable/>
          <datetime-element :params="element" v-else-if="'date' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <datetime-element :params="element" v-else-if="'time' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <datetime-element :params="element" v-else-if="'datetime' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <tag-element :params="element" v-else-if="'tag' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <link-element :params="element" v-else-if="'link' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <phone-element :params="element" v-else-if="'phone' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <email-element :params="element" v-else-if="'email' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <rating-element :params="element" v-else-if="'rating' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>
          <switch-element :params="element" v-else-if="'switch' === element.type" @focus="onFocusInput" @blur="onBlurInput" editable/>

          <span @click="removeElement(i)" class="delete-icon icon is-size-4 has-text-danger"><i class="far fa-times-circle"></i></span>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot-expander" @click="onBlurInput" v-if="!isActiveFooter">
      <span class="icon is-size-4"><i class="material-icons">arrow_drop_up</i></span>
    </footer>
    <footer class="modal-card-foot slider" :class="{ 'is-active': isActiveFooter }">
      <cl-buttons @add="addElement"/>
    </footer>

    <exit-confirm-modal ref="exitConfirmModal"/>
  </modal>
</template>

<script>
  import { ELEMENT } from '@/constant'
  import Modal from '@/components/Modal'
  import ExitConfirmModal from '@/components/ExitConfirmModal'
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

  export default {
    components: {
      Modal,
      ExitConfirmModal,
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
        item: {
          name: '',
          elements: [],
          createdAt: null,
          updatedAt: null
      },
        itemCacheStr: '',
        isActiveFooter: true,
        isSaved: false,
        errorMessage: ''
      }
    },
    computed: {
      isModified: ({item, itemCacheStr}) => itemCacheStr !== JSON.stringify(item)
    },
    created() {
      this.refresh()
      this.itemCacheStr = JSON.stringify(this.item)
    },
    mounted() {
      this.$refs.editTempItem.open()
    },
    beforeRouteLeave(to, from, next) {
      if (!this.isSaved && this.isModified) {
        this.$refs.exitConfirmModal.open(next)
      } else {
        next()
      }
    },
    methods: {
      refresh() {
        if (!this.$store.state.tempItem.elements.length) {
          this.addElement(Object.assign({}, ELEMENT, { type: 'text' }))
        } else {
          this.item = JSON.parse(JSON.stringify(this.$store.state.tempItem))
        }
      },
      close() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
        this.$refs.editTempItem.close()
      },
      save() {
        if (!this.item.createdAt) {
          this.item.createdAt = new Date()
        }
        this.item.updatedAt = new Date()
        this.$store.commit('SET_TEMP_ITEM', this.item)
        this.isSaved = true
        this.$router.push('/')
        this.close()
      },
      onFocusInput(e) {
        this.isActiveFooter = false
      },
      onBlurInput(e) {
        this.isActiveFooter = true
      },
      addElement(element) {
        this.item.elements.push(element)
        this.setOrder()
        this.$nextTick(() => {
          const container = this.$el.querySelector('.modal-card-body')
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
  #edit-temp-item {
    $button-count: 8;

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
      .action-modal-header {
        .template-checkbox {
          margin-bottom: 0;
        }
      }
      > .modal-card-body {
        $sort-button-size: 2rem;
        $margin-side: $sort-button-size + .5rem;
        height: 100%;
        padding: .5rem 0;
        background-color: white;
        overflow-y: scroll;
        -webkit-overflow-scrolling : touch;
        z-index: 0;

        .theme-field {
          .subtitle {
            margin-bottom: 0;
          }
          .theme-dropdown {
            width: 100%;

            .dropdown-trigger {
              width: 100%;

              .button {
                height: 1.75em;
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
        .item-name-content {
          margin: 0 1rem;

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
        }
        .item-elements {
          .element-field {
            justify-content: center;
            min-height: 78px;

            .sort-buttons {
              flex-direction: column;

              .button {
                padding: 0;

                .material-icons {
                  color: gainsboro;
                }
              }
              .element-order {
                font-size: .75em;
                text-align: center;
              }
            }
            .cl-element {
              width: 100%;
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
      .modal-card-foot-expander {
        background-color: white;
        text-align: center;
        box-shadow: $box-shadow;
        z-index: 1;
      }
      .modal-card-foot.slider {
        height: $element-button-size;
        max-height: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        border-radius: 0;
        overflow: scroll;
        -webkit-overflow-scrolling : touch;
        transition: max-height .2s;

        &.is-active {
          max-height: $element-button-size;
        }
        .buttons {
          flex-direction: row;
          width: $element-button-size * $button-count;
          min-width: $element-button-size * $button-count;
          margin-bottom: 0;

          .button {
            margin-bottom: 0;
          }
        }
      }
      .modal-card-foot {
        border-top: none;

        .checkbox {
          font-size: $size-small;
          margin-right: 1rem;
        }
      }
    }
  }
</style>
