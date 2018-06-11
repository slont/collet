<template>
  <cl-element class="link-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">link</i>
    </span>
    <div class="control">
      <input v-model.trim="url" class="input value" type="text" placeholder="Link"
             @change="fetchImage" @focus="$emit('focus')" @blur="$emit('blur')" v-if="editable">

      <div class="link-card card box" v-if="imageSrc || title" @click="onClickCard">
        <figure class="image flexbox">
          <img :src="imageSrc" alt="">
        </figure>
        <div class="card-content media">
          <div class="media-content">
            <div class="content">
              <h5 class="subtitle is-5 has-text-weight-bold">{{ title }}</h5>
              <p class="description is-size-6">{{ description }}</p>
            </div>

            <nav class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <p class="subtitle is-7 has-text-grey">{{ siteName }}</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <a :href="url" class="value" target="_blank" v-else-if="!editable">
        {{ url }}
      </a>
    </div>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'

  export default {
    components: { ClElement },
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
    },
    data() {
      const data = {
        url: '',
        siteName: '',
        title: '',
        imageSrc: '',
        description: ''
      }
      if (this.params.valueStr.startsWith('{')) {
        Object.assign(data, JSON.parse(this.params.valueStr))
      } else {
        data.url = this.params.valueStr
      }
      return data
    },
    computed: {
      isStartHttp() {
        return /^https?:\/\/.+/.test(this.url)
      }
    },
    created() {
      this.fetchImage()
    },
    methods: {
      onClickCard() {
        window.open().location.href = this.url
      },
      fetchImage() {
        if (!this.isStartHttp) {
          const url = this.url
          Object.assign(this.$data, this.$options.data.call(this))
          this.url = url
          this.params.valueStr = JSON.stringify(this.$data)
        } else if (this.isStartHttp && this.editable) {
          fetch(`https://opengraph.io/api/1.1/site/${encodeURIComponent(this.url)}?app_id=5b16d7821ae11d055fd7c70f`).then(res => {
            if (res.ok) {
              res.json().then(json => {
                this.siteName = json.hybridGraph.site_name || ''
                this.title = json.hybridGraph.title || ''
                this.imageSrc = json.hybridGraph.image || json.hybridGraph.imageSecureUrl || ''
                this.description = json.hybridGraph.description || ''
                this.params.valueStr = JSON.stringify(this.$data)
                this.params.valueNum = 0
              })
            }
          }).catch(() => {
            this.params.valueNum = -1
          })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .link-element {
    .input {
      padding-top: .25em;
      padding-left: .25em;
      border-left: none;
      border-top: none;
      border-right: none;
      border-radius: 0;
      box-shadow: none;

      &:focus, &:active {
        border-color: $primary;
      }
    }
    .link-card {
      max-width: 520px;
      padding: 0;
      margin: auto;
      cursor: pointer;

      .image {
        max-height: 10rem;
        width: 100%;
        margin: 0;
        overflow: hidden;
        border-top-right-radius: 6px;
        border-top-left-radius: 6px;
      }
      .card-content {
        .content {
          .subtitle,
          .description {
            max-height: 3.5em;
            overflow: hidden;
          }
        }
      }
    }
    .value {
      color: $link;
      text-decoration: underline;
      word-wrap: break-word;
    }
  }
</style>
