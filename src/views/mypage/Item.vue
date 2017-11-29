<template>
  <div id="mypage-item">
    <div class="item-image trim" v-if="item.image">
      <figure class="image is-4by3">
        <img :src="item.image" v-if="item.image">
      </figure>
      <div class="dark-mask" @click="$router.push(`/mypage/${theme.id}/${item.id}`)">
        <div class="title is-3">{{ item.title }}</div>
        <div class="subtitle is-6">{{ item.description }}</div>
      </div>
    </div>
    <div v-else>
      <div class="title is-3">{{ item.title }}</div>
      <div class="subtitle is-6">{{ item.description }}</div>
    </div>

    <div class="item-elements tile is-ancestor">
      <div v-for="(element, i) in item.elements" :key="i" class="field element-field">
        <text-element :params="element" v-if="'text' === element.type"></text-element>
        <image-element :params="element" v-else-if="'image' === element.type"></image-element>
        <location-element :params="element" v-else-if="'location' === element.type"></location-element>
        <datetime-element :params="element" v-else-if="'date' === element.type"></datetime-element>
        <datetime-element :params="element" v-else-if="'time' === element.type"></datetime-element>
        <datetime-element :params="element" v-else-if="'datetime' === element.type"></datetime-element>
        <tag-element :params="element" v-else-if="'tag' === element.type"></tag-element>
        <link-element :params="element" v-else-if="'link' === element.type"></link-element>
        <phone-element :params="element" v-else-if="'phone' === element.type"></phone-element>
        <email-element :params="element" v-else-if="'email' === element.type"></email-element>
        <rating-element :params="element" v-else-if="'rating' === element.type"></rating-element>
        <switch-element :params="element" v-else-if="'switch' === element.type"></switch-element>
      </div>
    </div>

    <div class="fixed-action-button vertical">
      <a class="button trigger-button is-float is-primary circle">
        <i class="material-icons">add</i>
      </a>
      <ul>
        <li>
          <a class="button button-create is-float is-link circle"
             @click="$refs.itemCreateModal.open(item.templates)">
            <i class="material-icons">insert_chart</i>
          </a>
        </li>
        <li>
          <a class="button button-create is-float is-info circle">
            <i class="material-icons">format_quote</i>
          </a>
        </li>
      </ul>
    </div>

    <item-create-modal ref="itemCreateModal" @refresh="refresh"></item-create-modal>
  </div>
</template>

<script>
  import ItemModel from '@/models/item'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
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
      ItemCreateModal,
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
        item: {
          title: '',
          elements: []
        }
      }
    },
    computed: {
      themeId() {
        return this.$route.params.themeId
      },
      itemId() {
        return this.$route.params.itemId
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        new ItemModel(this.themeId).findOne(this.itemId).then(res => {
          this.item = res
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #mypage-item {
    padding-top: 1em;

    .item-image {
      position: relative;
      display: flex;
      align-items: center;
      max-height: 14rem;

      .image {
        width: 100%;
      }
      .dark-mask {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        padding: .75rem;

        .title {
          color: white;
          padding-bottom: 1rem;
        }
        .subtitle {
          color: white;
        }
      }
    }
    .fixed-action-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;

      &.vertical ul {
        position: absolute;
        display: inline-flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: flex-start;
        bottom: 0;
        height: 500px;
        width: 100%;
        padding-bottom: 64px;
        visibility: hidden;

        li {
          .button {
            height: 40px;
            width: 40px;
            margin: .5rem;
          }
        }
        &:hover {
          visibility: visible;
        }
      }
      .trigger-button {
        z-index: 100;

        .material-icons {
          transition: all .3s;
        }
      }
      &:hover {
        .trigger-button {
          .material-icons {
            transform: rotate(-135deg);
          }
          + ul {
            visibility: visible;
          }
        }
      }
    }
  }
</style>
