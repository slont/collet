<template>
  <div id="settings-profile">
    <div class="modal-card-body columns">
      <div class="column is-8">
        <div class="field">
          <label class="label">ユーザネーム</label>
          <div class="control">
            <input v-model.trim="user.name" class="input" type="text"
                   name="name" v-validate="'required'">
            <span v-show="errors.has('name')" class="has-text-danger">{{ errors.first('name') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">メールアドレス</label>
          <div class="control">
            <input v-model.trim="user.email" class="input" type="email"
                   name="email" v-validate="'required'">
            <span v-show="errors.has('email')" class="has-text-danger">{{ errors.first('email') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">自己紹介</label>
          <div class="control">
            <textarea v-model="user.biography" v-autosize="user.biography" class="textarea" rows="2"></textarea>
          </div>
        </div>

        <a class="password-setting-expand flexbox has-align-centered" @click="expandedPasswordSetting = !expandedPasswordSetting">
          パスワード再設定
          <span class="icon" v-if="expandedPasswordSetting"><i class="material-icons">keyboard_arrow_up</i></span>
          <span class="icon" v-else><i class="material-icons">keyboard_arrow_down</i></span>
        </a>
        <div class="password-setting-area" v-if="expandedPasswordSetting">
          <div class="field">
            <label class="label">現在のパスワード</label>
            <div class="control">
              <input v-model.trim="user.password" class="input" type="password"
                     name="password" v-validate="'required'">
              <span v-show="errors.has('password')" class="has-text-danger">{{ errors.first('password') }}</span>
            </div>
          </div>

          <div class="field">
            <label class="label">新しいパスワード</label>
            <div class="control">
              <input v-model.trim="newPassword" class="input" type="password"
                     name="newPassword" v-validate="'required'">
              <span v-show="errors.has('newPassword')" class="has-text-danger">{{ errors.first('newPassword') }}</span>
            </div>
          </div>

          <div class="field">
            <label class="label">新しいパスワードの確認</label>
            <div class="control">
              <input v-model.trim="confirmPassword" class="input" type="password"
                     name="confirmPassword" v-validate="'required|confirmed:newPassword'">
              <span v-show="errors.has('confirmPassword')" class="has-text-danger">{{ errors.first('confirmPassword') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="field image-field">
          <label class="label">イメージ画像</label>
          <div class="control loading-mask" :class="{ 'is-loading': user.image.substring(0, 4) === 'data' }">
            <div class="file is-boxed">
              <label class="file-label">
                <input @change="changeImage" class="file-input" type="file" name="resume">
                <span class="file-view" v-if="user.image">
                  <img :src="user.image" v-if="user.image.substring(0, 4) === 'data'"/>
                  <img :src="user.image" :srcset="`${user.image}_640w 640w`" v-else/>
                  <a @click.stop.prevent="removeImage" class="delete"></a>
                </span>
                <span class="file-cta" v-else>
              <span class="file-icon"><i class="material-icons">file_upload</i></span>
              <span class="file-label">Upload Image...</span>
            </span>
              </label>
            </div>
          </div>
        </div>

        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
        <div class="save-button has-right">
          <a @click="save" class="button is-primary">保存</a>
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
        user: {
          id: '',
          name: '',
          email: '',
          biography: '',
          image: '',
          password: ''
        },
        expandedPasswordSetting: false,
        newPassword: '',
        confirmPassword: '',
        errorMessage: ''
      }
    },
    created() {
      this.user = Object.assign({}, this.$store.state.user)
    },
    methods: {
      save() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          const body = Object.assign({}, this.user, {
            newPassword: this.newPassword
          })
          if (!this.expandedPasswordSetting) {
            delete body.password
            delete body.newPassword
          }
          new UserModel().update(this.user.id, body).then(() => {
            const newUser = Object.assign({}, this.user, body)
            delete newUser.password
            delete newUser.newPassword
            this.$store.dispatch('setUser', newUser)
            this.$message({
              showClose: true,
              message: '保存されました',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
            this.errorMessage = err.message
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
    .password-setting-expand {
      margin-top: 1.5rem;
    }
    .password-setting-area {
      padding: 1rem 0;
    }
  }
</style>
