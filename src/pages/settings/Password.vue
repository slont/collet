<template>
  <div id="settings-password">
    <div class="field">
      <div class="control">
        <router-link to="/settings" class="label is-size-5 text-color-weak is-hidden-desktop">
          <span class="icon"><i class="fas fa-arrow-left fa-fw"></i></span>
          設定
        </router-link>
      </div>
    </div>

    <div class="field">
      <label class="label">現在のパスワード</label>
      <div class="control">
        <input v-model.trim="password" class="input" type="password"
               name="password" v-validate="'required|max:60|regex:^([\\w-]+)$'">
        <span v-show="errors.has('password')" class="has-text-danger">{{ errors.first('password') }}</span>
      </div>
    </div>

    <div class="field">
      <label class="label">新しいパスワード（半角英数字、記号[-_@#$%^&*+!?]）</label>
      <div class="control">
        <input v-model.trim="newPassword" class="input" type="password"
               name="newPassword" v-validate="'required|max:60|regex:^([\\w-@#\\$%\\^&\\*\\+\\!\\?]+)$'">
        <span v-show="errors.has('newPassword')" class="has-text-danger">{{ errors.first('newPassword') }}</span>
      </div>
    </div>

    <div class="save-button has-right">
      <guard-button :click="save" class="button is-info">変更</guard-button>
    </div>
  </div>
</template>

<script>
  import UserModel from '@/models/User'

  export default {
    data() {
      return {
        password: '',
        newPassword: ''
      }
    },
    created() {
      this.user = Object.assign({}, this.$store.state.user)
    },
    methods: {
      save() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          new UserModel().updatePassword(this.$store.state.user.id, {
            password: this.password,
            newPassword: this.newPassword
          }).then(() => {
            this.$toast.open({
              message: '変更されました',
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #settings-password {
    padding: 1rem;
  }
</style>
