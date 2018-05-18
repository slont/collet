<template>
  <div id="settings-profile">
    <router-link to="/settings" class="label">/設定</router-link>

    <div class="columns">
      <div class="column is-8">
        <div class="field">
          <label class="label">ユーザーID（半角英数字、記号[-_]）</label>
          <div class="control">
            <input v-model.trim="user.id" class="input" type="text"
                   name="userId" v-validate="'required|max:32|regex:^([\\w-]+)$'">
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
                   name="email" v-validate="'required|max:255'">
            <span v-show="errors.has('email')" class="has-text-danger">{{ errors.first('email') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">自己紹介</label>
          <div class="control">
            <textarea v-model="user.biography" v-autosize="user.biography" class="textarea" rows="2"></textarea>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="field image-field">
          <label class="label">イメージ画像</label>
          <div class="control">
            <div class="file is-boxed">
              <label class="file-label">
                <input @change="changeImage" class="file-input" type="file" name="resume">
                <div class="file-view" v-if="user.image">
                  <img :src="user.image" v-if="loading"/>
                  <user-image :src="user.image" v-else/>
                  <a @click.stop.prevent="removeImage" class="delete"></a>
                </div>
                <div class="file-cta" v-else>
                  <span class="icon is-size-1"><i class="material-icons">add</i></span>
                </div>
                <div class="control loading-mask is-size-1" :class="{ 'is-loading': loading }"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="save-button has-right">
          <guard-button :click="save" class="button is-info" :disabled="loading">保存</guard-button>
        </div>
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
      loading: vue => (/^data:.+/.test(vue.user.image))
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
            this.$message({
              showClose: true,
              message: '保存されました',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
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

    .delete {
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 10;
    }
  }
</style>
