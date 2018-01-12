<template>
  <div id="userpage-item">
    <div class="item-info">
      <div class="title is-3">
        {{ item.name }}
        <button class="button is-info is-outlined" @click="$refs.itemEditModal.open(item)"
                v-if="isMyPage">
          <span class="icon"><i class="material-icons">edit</i></span>
        </button>
      </div>
      <div class="subtitle is-6">{{ item.description }}</div>

      <figure class="image">
        <img :src="item.image" v-if="item.image">
      </figure>
    </div>

    <div class="item-elements">
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

    <item-edit-modal ref="itemEditModal" @refresh="refresh"></item-edit-modal>
  </div>
</template>

<script>
  import ItemModel from '@/models/item'
  import ItemEditModal from '@/components/item/ItemEditModal'
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
      ItemEditModal,
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
    props: {
      currentItem: {
        type: Object,
        default: () => ({
          id: ''
        })
      }
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
      isMyPage() {
        return this.$store.state.user.id === this.$route.params.userId
      },
      themeId() {
        return this.$route.params.themeId
      },
      itemId() {
        return this.currentItem.id || this.$route.params.itemId
      }
    },
    watch: {
      'currentItem.id': 'refresh'
    },
    mounted() {
      this.refresh()
    },
    methods: {
      refresh() {
        new ItemModel(this.themeId).findOne(this.itemId).then(res => {
          this.item = res
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-item {
    .item-info {
      margin-bottom: 2rem;

      .title {
        border-bottom: $border-style;
      }
      .subtitle {
        line-height: inherit;
      }
      .image {
        img {
          width: 70%;
          margin: auto;
        }
      }
    }
  }
</style>
