<template>
  <cl-element class="rating-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable">
    <span class="element-type-icon icon is-small is-left" v-if="editable"><rating-icon/></span>
    <p class="control">
      <el-rate v-model="params.valueNum" :max="Number(params.valueStr)" :disabled="!editable"/>
    </p>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'
  import RatingIcon from '@/components/RatingIcon'

  export default {
    components: { ClElement, RatingIcon },
    props: {
      params: {
        type: Object,
        default: {
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        }
      },
      editable: Boolean
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .rating-element {
    .element-type-icon .rating-icon {
      display: flex;

      > .material-icons {
        font-size: .5em;
        color: gainsboro;
      }
    }
  }
</style>
