<template>
  <div class="element-view">
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
</template>

<script>
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
      element: {
        type: Object,
        default: {
          type: '',
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .element-view {
  }
</style>
