<template>
  <cl-element class="link-element" :params="params" placeholder="ラベル（オプショナル）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">link</i>
    </span>
    <div class="control">
      <input v-model.trim="url" class="input value" type="text" placeholder="Link"
             @input="fetchImage" @focus="$emit('focus')" @blur="$emit('blur')" v-if="editable">

      <div class="link-card card box" v-if="imageSrc || title" @click.stop.prevent="onClickCard">
        <figure class="image flexbox"><img :src="imageSrc" alt=""></figure>
        <div class="card-content">
          <div class="content">
            <h5 class="subtitle is-5 has-text-weight-bold">{{ title }}</h5>
            <p class="description is-size-6">{{ description }}</p>
          </div>

          <nav class="level is-mobile">
            <div class="level-left fullwidth">
              <div class="level-item fullwidth">
                <p class="subtitle is-size-8 has-text-grey">{{ siteName }}</p>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <a :href="url" class="value" target="_blank" rel="noopener noreferrer" v-else-if="!editable">
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
        description: '',
        isFetching: false
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
        window.open(this.url, '_blank', 'noopener')
      },
      fetchImage() {
        if (!this.isStartHttp) {
          const url = this.url
          Object.assign(this.$data, this.$options.data.call(this))
          this.url = url
          this.params.valueStr = JSON.stringify(this.$data)
        } else if (this.isStartHttp && this.editable && !this.isFetching) {
          this.isFetching = true
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
            this.isFetching = false
          }).catch(() => {
            this.params.valueNum = -1
            this.isFetching = false
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
      display: flex;
      max-width: 520px;
      max-height: 8rem;
      padding: 0;
      margin: auto;
      cursor: pointer;
      box-shadow: 0 2px 3px rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .1);

      .image {
        justify-content: center;
        max-width: 38%;
        margin: 0;
        border-radius: 5px 0 0 5px;

        img {
          height: 8rem;
          max-width: initial;
          width: auto;
        }
      }
      .card-content {
        flex: 1;

        .content {
          margin-bottom: .5em !important;

          .subtitle {
            max-height: 2.25em;
            margin-bottom: .5em !important;
            overflow: hidden;
          }
          .description {
            max-height: 2.25em;
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

    @media screen and (min-width: 769px) {
      .link-card {
        flex-direction: column;
        max-height: 20rem;

        .image {
          max-width: 100%;
          border-radius: 5px 5px 0 0;

          img {
            height: initial;
            width: 100%;
          }
        }
      }
    }

    @media screen and (max-width: 768px) {
      .link-card {
      }
    }
  }
</style>
