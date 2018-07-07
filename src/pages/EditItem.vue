<template>
  <modal id="edit-item" class="modal" ref="editItem">
    <header class="action-modal-header modal-card-head">
      <span class="back-button icon is-size-3" @click="$router.go(-1)">
        <i class="material-icons">arrow_back</i>
      </span>

      <span class="modal-card-title title is-6 has-text-white">カレット編集</span>

      <div class="template-checkbox field">
        <input v-model="isTemplate" class="is-checkradio has-background-color is-white is-small" id="templateCheckbox" type="checkbox" :checked="isTemplate">
        <label for="templateCheckbox">テンプレート登録</label>
      </div>

      <guard-button :click="save" class="ok-button is-success is-inverted is-outlined is-size-5">
        保存
      </guard-button>
    </header>
    <header class="theme-header modal-card-head header-shadow" @click="openThemeSelectModal">
      <a class="text-color-base">
        <span class="theme-title is-size-6">{{ theme.title }}</span>
        <span class="icon has-text-grey-light is-size-4"><i class="material-icons">arrow_drop_down</i></span>
      </a>
    </header>

    <div class="modal-card-body">
      <div class="item-name-content content">
        <div class="field">
          <div class="item-name control">
            <input v-model.trim="item.name" class="input title is-4 is-primary text-color-main" type="text" placeholder="Cullet Name"
                   name="culletName" v-validate="'required'" :class="{ 'is-danger': errors.has('culletName') }"
                   @focus="onFocusInput" @blur="onBlurInput">
            <span v-show="errors.has('culletName')" class="help is-danger">{{ errors.first('culletName') }}</span>
          </div>
        </div>
      </div>

      <transition-group tag="div" name="element-list" class="item-elements">
        <div v-for="(element, i) in item.elements" :key="element.orderId" class="field element-field flexbox">
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
      </transition-group>
    </div>

    <footer class="modal-card-foot-expander" @click="onBlurInput" v-if="!isActiveFooter">
      <span class="icon is-size-4"><i class="material-icons">arrow_drop_up</i></span>
    </footer>
    <footer class="modal-card-foot slider" :class="{ 'is-active': isActiveFooter }">
      <cl-buttons @add="addElement"/>
    </footer>

    <theme-select-modal ref="themeSelectModal" @refresh="refreshTheme"/>
    <item-delete-modal ref="itemDeleteModal" @refresh="callbackDelete"/>
    <exit-confirm-modal ref="exitConfirmModal"/>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import TemplateModel from '@/models/Template'
  import ItemModel from '@/models/Item'
  import Modal from '@/components/Modal'
  import ThemeSelectModal from '@/components/theme/ThemeSelectModal'
  import ItemDeleteModal from '@/components/item/ItemDeleteModal'
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
      ThemeSelectModal,
      ItemDeleteModal,
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
        theme: {
          id: '',
          title: '',
          templates: []
        },
        item: {
          name: '',
          elements: []
        },
        itemCacheStr: '',
        themes: [],
        templates: [],
        selectedTemplateNo: 0,
        isTemplate: false,
        isActiveFooter: true,
        isSaved: false,
        errorMessage: ''
      }
    },
    computed: {
      user: ({$store}) => $store.state.user,
      themeId: ({$route}) => $route.params.themeId,
      itemId: ({$route}) => $route.params.itemId,
      isModified: ({item, itemCacheStr}) => itemCacheStr !== JSON.stringify(item)
    },
    created() {
      if (this.themeId === this.$store.state.theme.id) {
        Object.assign(this.theme, new ThemeModel._deserialize(this.$store.state.theme))
      }
      this.refresh().then(() => this.$refs.editItem.open())
    },
    beforeRouteUpdate(to, from, next) {
      if (this.$refs.themeSelectModal.$refs.themeSelectModal.active) {
        this.$refs.themeSelectModal.close()
        next(false)
      } else if (this.$refs.itemDeleteModal.$refs.itemDeleteModal.active) {
        this.$refs.itemDeleteModal.close()
        next(false)
      } else {
        if (!this.isSaved && this.isModified) {
          this.$refs.exitConfirmModal.open(next)
        } else {
          next()
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.$refs.themeSelectModal.$refs.themeSelectModal.active) {
        this.$refs.themeSelectModal.close()
        next(false)
      } else if (this.$refs.itemDeleteModal.$refs.itemDeleteModal.active) {
        this.$refs.itemDeleteModal.close()
        next(false)
      } else {
        if (!this.isSaved && this.isModified) {
          this.$refs.exitConfirmModal.open(next)
        } else {
          next()
        }
      }
    },
    methods: {
      async refresh() {
        new ThemeModel().findOne(this.themeId).then(res => {
          this.theme = res.data
        })

        await new ItemModel(this.themeId).findOne(this.itemId).then(res => {
          const item = res.data
          item.elements.forEach(e => {
            e.orderId = e.order
          })
          this.item = item
          this.$refs.editItem.open()

          this.$nextTick(() => {
            this.itemCacheStr = JSON.stringify(this.item)
          })
        }).catch(err => {
          console.log(err)
          this.$toast.open({
            message: 'データ取得に失敗しました',
            type: 'is-danger'
          })
          this.$router.replace('/')
        })
      },
      async refreshTheme(theme) {
        this.theme = theme
      },
      close() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
        this.$refs.editItem.close()
      },
      async save() {
        if (!this.item.name) {
          this.item.name = this.$moment().format('YYYY/MM/DD HH:mm:ss')
        }
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.setOrder()
          const body = Object.assign({
            isTemplate: this.isTemplate
          }, this.item)
          await new ItemModel(this.theme.id).update(this.item.id, body).catch(err => {
            this.errorMessage = err
          })

          this.isSaved = true
          this.cacheTheme()
          this.$toast.open({
            message: '更新されました',
            type: 'is-success'
          })
          this.$router.push(`/u/${this.user.id}/${this.theme.id}/${this.item.id}`)
          this.close()
        }).catch(err => this.$toast.open({
          message: err,
          type: 'is-danger'
        }))
      },
      onFocusInput(e) {
        this.isActiveFooter = false
      },
      onBlurInput(e) {
        this.isActiveFooter = true
      },
      addElement(element) {
        this.item.elements.push(Object.assign(element, {
          orderId: `${this.item.elements.length}-${new Date().getTime()}`
        }))
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
      },
      openThemeSelectModal() {
        this.$refs.themeSelectModal.open(this.theme)
      },
      openDeleteModal() {
        this.$refs.itemDeleteModal.open(this.theme, this.item)
      },
      callbackDelete() {
        this.isSaved = true
        this.$router.replace(`/u/${this.user.id}/${this.theme.id}`)
      },
      cacheTheme() {
        this.$store.commit('SET_THEME', this.theme)
        if (this.isTemplate) {
          new TemplateModel(this.theme.id).find({ p: 1, s: 1 }).then(res => {
            this.$store.commit('SET_TEMPLATES', res.data)
          }).catch(err => console.log(err))
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #edit-item {
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
      .theme-header {
        padding: 0;
        border-bottom: none;
        background-color: white;
        z-index: 1;

        a {
          display: flex;
          align-items: center;
          width: 100%;
          padding: .5rem 1rem;

          .theme-title {
            width: 95%;
            margin-right: auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
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
          width: calc(#{$element-button-size} * #{$button-count} - #{$button-count - 1}px);
          min-width: calc(#{$element-button-size} * #{$button-count} - #{$button-count - 1}px);
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
