<template>
  <div class="box box-default">
    <div class="overlay" v-if="loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <div class="box-header with-border">
      <h3 class="box-title">Edit User</h3>
      <div class="box-tools pull-right">
        <a type="button" class="btn btn-box-tool"
           @click="closeInfo()">
          <i class="fa fa-times"></i>
        </a>
      </div>
    </div>
    <div class="box-body">
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">New Password:</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" v-model="form.password"/>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="form-group">
            <label class="col-xs-12 control-label line-checkTip"
                   :class="[check.password.check ? 'line-checkOk' : 'line-checkErr']">{{check.password.message}}</label>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Repeat Password:</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" v-model="rePassword"/>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="form-group">
            <label class="col-xs-12 control-label line-checkTip"
                   :class="[check.rePassword.check ? 'line-checkOk' : 'line-checkErr']">{{check.rePassword.message}}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <a type="submit" class="btn btn-info btn-flat"
         :disabled="!isCanSub"
         @click="isCanSub && submit()">
              <span>
                <i class="fa fa-save"></i>
                Save
              </span>
      </a>
      <a type="submit" class="btn btn-default btn-flat pull-right"
         @click="closeInfo()">
        <i class="fa fa-mail-reply"></i>
        Back</a>
    </div>
  </div>
</template>
<script>
  import checkData from '../../../helper/CheckData'
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import messageBox from '../../../components/msgbox'
  const tipMsg = [
    'Empty is not allowed.',
    'Space is not allowed.',
    'Minimal characters are not less than 6.',
    'Maximal characters are not more than 20.',
    'Characters are limited with 0-9,a-z,A-Z or !@#$&*.'
  ]
  const reTipMsg = 'Passwords are not matched.'
  const tipOkMsg = 'Success'

  export default {
    props: ['user'],
    mounted () {
      this.form.id = this.user.id
    },
    created () {
      let check = {
        rePassword: {
          check: false,
          message: ''
        }
      }
      for (let key of (Object.keys(this.form))) {
        check[key] = {
          check: false,
          message: ''
        }
      }
      this.check = check
      this.$watch('form.password', function (value) {
        this.checkPassword()
        let checkKey = checkData(value, 'notNull', 'notSpace', 'moreThan6', 'moreThan20', 'pwdReg')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.check.password.check = false
            this.check.password.message = tipMsg[i]
            return
          }
        }
        this.check.password.check = true
        this.check.password.message = tipOkMsg
      })
      this.$watch('rePassword', function () {
        this.checkPassword()
      })
    },
    methods: {
      checkPassword () {
        let check = this.rePassword === this.form.password
        this.check.rePassword.check = check
        if (check) {
          this.check.rePassword.message = tipOkMsg
        } else {
          this.check.rePassword.message = reTipMsg
        }
      },
      closeInfo () {
        this.$emit('close')
      },
      submit () {
        this.loading = true
        getData(xhrUrls.RESET_USER_PASSWORD, {
          ...this.form
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            messageBox.alert('Success').then(() => {
              this.$emit('reload')
              this.closeInfo()
            })
            console.log(res)
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      }
    },
    computed: {
      isCanSub () {
        if (!this.check) {
          return false
        }
        let isSub = true
        for (let key of ['rePassword', 'password']) {
          isSub = this.check[key].check ? isSub : this.check[key].check
        }
        return isSub
      }
    },
    data () {
      return {
        loading: false,
        rePassword: '',
        form: {
          id: '',
          password: ''
        },
        check: null
      }
    }
  }
</script>