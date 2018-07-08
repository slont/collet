<template>
  <div id="settings-profile">
    <div class="field">
      <div class="control">
        <router-link to="/settings" class="label is-size-5 text-color-weak is-hidden-desktop">
          <span class="icon"><i class="fas fa-arrow-left fa-fw"></i></span>
          設定
        </router-link>
      </div>
    </div>

    <div class="field image-field">
      <label class="label">イメージ画像</label>
      <div class="control">
        <div class="file is-boxed is-centered">
          <label class="file-label">
            <input @change="changeImage" class="file-input" type="file" name="resume" v-show="false">
            <span class="file-view" v-if="user.image">
              <img :src="user.image" class="circle" v-if="loading"/>
              <user-image :src="user.image" class="circle" v-else/>
            </span>
            <span class="file-cta" v-else>
              <span class="icon is-size-1"><i class="material-icons">add</i></span>
            </span>
            <span class="control loading-mask is-size-1" :class="{ 'is-loading': loading }"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">ユーザーID</label>
      <div class="control">
        <input v-model.trim="user.id" class="input" type="text"
               name="userId" v-validate="'required|max:32|regex:^([\\w-]+)$'" readonly>
        <span v-show="errors.has('userId')" class="has-text-danger">{{ errors.first('userId') }}</span>
      </div>
    </div>

    <div class="field">
      <label class="label">ユーザーネーム</label>
      <div class="control">
        <input v-model.trim="user.name" class="input" type="text"
               name="userName" v-validate="'required|max:32'">
        <span v-show="errors.has('userName')" class="has-text-danger">{{ errors.first('userName') }}</span>
      </div>
    </div>

    <div class="field">
      <label class="label">メールアドレス</label>
      <div class="control">
        <input v-model.trim="user.email" class="input" type="email"
               name="email" v-validate="'email|max:255' + (user.email ? '|required' : '')">
        <span v-show="errors.has('email')" class="has-text-danger">{{ errors.first('email') }}</span>
      </div>
    </div>

    <div class="field">
      <label class="label">自己紹介</label>
      <div class="control">
        <textarea v-model="user.biography" v-autosize="user.biography" class="textarea" rows="2"></textarea>
      </div>
    </div>

    <div class="field">
      <div class="control has-text-right">
        <guard-button :click="save" class="button is-info" :disabled="loading">保存</guard-button>
      </div>
    </div>
  </div>
</template>

<script>
  import FileModel from '@/models/File'
  import UserModel from '@/models/User'

  export default {
    data() {
      return {
        id: '',
        user: {
          id: '',
          name: '',
          email: '',
          biography: '',
          image: ''
        }
      }
    },
    computed: {
      loading() {
        return /^data:.+/.test(this.user.image)
      }
    },
    created() {
      this.id = this.$store.state.user.id
      this.user = Object.assign({}, this.$store.state.user)
    },
    methods: {
      save() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          new UserModel().update(this.id, {
            id: this.user.id,
            name: this.user.name,
            email: this.user.email,
            biography: this.user.biography,
            image: this.user.image
          }).then(() => {
            this.$store.commit('SET_USER', this.user)
            this.id = this.user.id
            this.$router.push(`/u/${this.user.id}`)
            this.$toast.open({
              message: '保存されました',
              type: 'is-success'
            })
          }).catch(err => {
            console.log(err)
            this.$toast.open({
              message: err.message,
              type: 'is-danger'
            })
          })
        })
      },
      changeImage(e) {
        this.createDataUrl(e, (dataUrl, fileName) => {
          this.user.image = dataUrl
          new FileModel().create(this.dataURLtoBlob(dataUrl), fileName).then(res => {
            this.user.image = res.data.path
          })
        })
      },
      removeImage() {
        this.user.image = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #settings-profile {
    padding: 1rem;

    .file-view .circle {
      height: 5rem;
      width: 5rem;
    }
  }
</style>
