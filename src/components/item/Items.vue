<template>
  <div class="items">
    <div v-if="isLastFetch && !value.length">
      ヒットする検索結果がありません
    </div>
    <transition-group tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
      <div v-for="(key) in Object.keys(itemsColumns)" class="column is-12-mobile is-6-tablet" :key="`column-${key}`">
        <div v-for="item in itemsColumns[key]" class="item-list" :key="item.id" v-if="itemsColumns[key].length">
          <router-link :to="`/u/${item.theme.createdUser.id}/${item.theme.id}/${item.id}`"
                       tag="div" class="cullet-card card">
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <router-link class="theme-title subtitle text-color-weak is-size-7 clickable" tag="div"
                               :to="`/u/${item.theme.createdUser.id}/${item.theme.id}`">
                    {{ item.theme.title }}
                    <span class="icon" v-if="item.theme.private"><i class="fas fa-lock fa-fw"></i></span>
                  </router-link>
                  <div class="item-title text-color-strong is-size-5 has-text-weight-bold clickable">
                    {{ item.name }}
                  </div>
                  <div class="updated-at text-color-weak is-size-8">
                    <span class="icon"><i class="far fa-clock"></i></span>
                    <span>{{ fromNow(item.updatedAt, 'YYYY/MM/DD') }}</span>
                  </div>
                </div>

                <div class="media-right" v-if="item.theme.image">
                  <figure class="image"><img :src="item.theme.image" :srcset="`${item.theme.image}_640w 640w`"></figure>
                </div>
              </div>

              <div class="content" v-if="item.elements.length">
                <template v-if="2 <= item.elements.length && 'image' === item.elements[0].type && 'image' === item.elements[1].type">
                  <div class="images-divided-2 flexbox">
                    <div class="image-left trim">
                      <img :src="item.elements[0].valueStr" :srcset="`${item.elements[0].valueStr}_640w 640w`"/>
                    </div>
                    <div class="image-right trim">
                      <img :src="item.elements[1].valueStr" :srcset="`${item.elements[1].valueStr}_640w 640w`"/>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <element-view :element="item.elements[0]"/>
                  <element-view :element="item.elements[1]" v-if="item.elements[1]"/>
                </template>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="button is-loading fullwidth is-large" key="loading" v-if="!isLastFetch"></div>
    </transition-group>
  </div>
</template>

<script>
  import ElementView from '@/components/element/ElementView'

  export default {
    components: {ElementView},
    props: {
      value: {
        type: Array,
        default: () => []
      },
      isLastFetch: false
    },
    computed: {
      itemsColumns() {
        if (this.isMobile) {
          return {
            0: this.value,
            1: []
          }
        } else {
          return {
            0: this.value.filter((item, i) => 0 === i % 2),
            1: this.value.filter((item, i) => 1 === i % 2)
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .items {
    max-width: $width;
    margin: 0 auto;

    .item-list {
      padding: 0;
      margin: 0 0 1em;

      .cullet-card {
        &:hover {
          cursor: pointer;
        }
        .card-content {
          .media {
            margin-bottom: .25em;

            .media-content {
              > :not(:last-child) {
                margin-bottom: .3em;
              }
              .theme-title {
                height: 1rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap
              }
              .item-title {
                display: flex;
                max-height: 2.5em;
                overflow: hidden;
              }
            }
            .media-right {
              .image {
                height: 54px;
                overflow: hidden;

                img {
                  height: 100%;
                  width: auto;
                }
              }
            }
            + .content {
              margin-top: 1.5em;
            }
          } // .media
          .content {
            > :not(:last-child) {
              margin-bottom: 1.5em;
            }
            .view-label {
              font-size: $size-7;
              color: $text-color-weak;
            }
            .element-view {
              .text-element {
                .control {
                  max-height: 164px;
                  overflow: hidden;

                  .value {
                    font-size: $size-6;
                  }
                }
              }
              .image-element {
                .file-view {
                  display: flex;
                  align-items: center;
                  max-height: 24em;
                  margin: 0;
                  overflow: hidden;
                }
              }
            }
          }
        } // .card-content
      }
    } // .item-list

    @media screen and (min-width: 769px) {
      .item-list {
      }
    }

    @media screen and (max-width: 768px) {
      > .columns {
        margin: 0;

        > .column {
          padding: 0;
        }
      }
    }
  }
</style>
