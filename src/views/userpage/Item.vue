<template>
  <div id="userpage-item">
    <div class="item-image trim" v-if="item.image">
      <figure class="image is-4by3">
        <img :src="item.image" v-if="item.image">
      </figure>
    </div>
    <div class="item-info">
      <div class="title is-2">
        {{ item.name }}
        <button class="button is-primary is-outlined" @click="$refs.itemEditModal.open(item)"
                v-if="isMyPage">
          <span class="icon"><i class="material-icons">edit</i></span>
        </button>
      </div>
      <div class="subtitle is-6">{{ item.description }}</div>
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
        return this.$store.state.user.name === this.$route.params.userName
      },
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
    padding-top: 1em;
    width: $item-page-width;

    .item-image {
      position: relative;
      display: flex;
      align-items: center;
      max-height: 14rem;
      margin-bottom: 2.5rem;

      .image {
        width: 100%;
      }
    }
    .item-info {
      margin-bottom: 2rem;

      .title {
        border-bottom: $border;
      }
      .subtitle {
        line-height: inherit;
      }
    }
  }
</style>
