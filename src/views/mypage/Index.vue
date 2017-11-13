<template>
  <div id="mypage-index">
    <div class="columns is-multiline">
      <div v-for="theme in themes" class="column is-one-third-tablet" :key="theme.id">
        <my-theme-card :theme="theme" @open-edit-modal="$refs.themeEditModal.open(theme)"></my-theme-card>
      </div>
    </div>
    <a @click="$refs.themeCreateModal.open()" class="button button-create is-float is-primary circle">
      <i class="material-icons">add</i>
    </a>

    <theme-create-modal ref="themeCreateModal" @refresh="refresh"></theme-create-modal>
    <theme-edit-modal ref="themeEditModal" @refresh="refresh"></theme-edit-modal>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import MyThemeCard from '@/components/theme/MyThemeCard'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'

  export default {
    components: { MyThemeCard, ThemeCreateModal, ThemeEditModal },
    data() {
      return {
        themes: []
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        new ThemeModel().find({
          p: 0,
          s: 20
        }).then(res => {
          this.themes = res
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #mypage-index {
    padding-top: 1em;
  }
</style>
