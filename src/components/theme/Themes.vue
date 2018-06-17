<template>
  <div class="themes">
    <div v-if="isLastFetch && !value.length">
      ヒットする検索結果がありません
    </div>
    <transition-group name="slide-fade" mode="out-in" class="columns is-multiline" v-else>
      <div v-for="theme in value" class="column is-half" :key="theme.id">
        <theme-card :theme="theme" @open-edit-modal="$emit('open-edit-modal', theme)"/>
      </div>
      <div class="button is-loading fullwidth is-large" key="loading" v-if="!isLastFetch"></div>
    </transition-group>
  </div>
</template>

<script>
  import ThemeCard from '@/components/theme/ThemeCard'

  export default {
    components: { ThemeCard },
    props: {
      value: {
        type: Array,
        default: () => []
      },
      isLastFetch: false
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .themes {
    max-width: $width;
    margin: 0 auto;

    > .columns {
      padding-top: 1em;
    }

    @media screen and (min-width: 769px) {
      .theme-card {
        .card-image > .image,
        .dark-mask {
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
        }
      }
    }

    @media screen and (max-width: 768px) {
      .columns {
        margin: 0;

        .column {
          padding: .25rem;
        }
      }
    }
  }
</style>
