<template>
  <div id="temp-item">
    <div class="container">
      <div class="cullet-container">
        <div class="cullet-content">
          <div class="cullet-info">
            <div class="updated-at text-color-weak is-size-8" v-if="item.updatedAt">
              <span>{{ fromNow(item.createdAt, 'YYYY/MM/DD HH:mm') }}</span>
              <span v-if="1 < $moment(item.updatedAt).diff($moment(item.createdAt), 'hours')">
                  ({{ item.updatedAt | moment('MM/DD HH:mm') }} 更新)
                </span>
            </div>
            <div class="title is-3 flexbox">
              {{ item.name }}

              <template v-if="!loggedIn">
                <a class="edit-button button is-info is-outlined is-size-7" v-if="isMobile"
                   @click="$router.push(`/m/editTempItem`)">
                  <span class="icon"><i class="material-icons">edit</i></span>
                  <span>編集</span>
                </a>
              </template>
            </div>
          </div>

          <div class="item-elements">
            <div v-for="(element, i) in item.elements" :key="i" class="field element-field">
              <element-view :element="element"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { ElementView },
    data() {
      return {
        item: {
          name: '',
          elements: []
        }
      }
    },
    created() {
      this.item = JSON.parse(JSON.stringify(this.$store.state.tempItem))
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #temp-item {
    height: calc(100vh - #{$header-nav-height});
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;
    background-color: white;

    > .container {
      padding: 1rem;
      max-width: 720px;
    }
    .cullet-container {
      position: relative;
      min-height: 80vh;

      .cullet-content {
        position: absolute;
        width: 100%;

        > :last-child {
          margin-bottom: 120px;
        }
        .cullet-info {
          margin-bottom: 1rem;
          border-bottom: $border-style;

          .title {
            line-height: 1.25;
            font-feature-settings: 'palt' 1;
            letter-spacing: .04em;

            .edit-button {
              margin-left: auto;
            }
          }
        }
        .item-elements {
          .element-field:not(:last-child) {
            margin-bottom: 2em;
          }
        }
      }
    }
  }
</style>
