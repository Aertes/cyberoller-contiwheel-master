<template>
  <div>
    <div class="row animated fadeInUp">
      <div class="col-xs-12">
        <div class="nav-tabs-custom box noneBox">
          <div class="overlay" v-if="loading">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <ul class="nav nav-tabs">
            <li class="active"><a href="#user_info_update" data-toggle="tab">Modify information</a></li>
            <li><a href="#user_password_update" data-toggle="tab">Modify password</a></li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane active" id="user_info_update">
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="form-group">
                    <label class="col-sm-6 control-label">User Name:</label>
                    <div class="col-sm-6">
                      <input type="text" v-model="name" class="form-control"/>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <div class="form-group">
                    <label class="col-xs-12 control-label line-checkTip"
                           :class="[nameCheck.check ? 'line-checkOk' : 'line-checkErr']">{{nameCheck.message}}</label>
                  </div>
                </div>
              </div>
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="form-group">
                    <label class="col-sm-6 control-label">EMail:</label>
                    <div class="col-sm-6">
                      <input type="text" v-model="email" class="form-control"/>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <div class="form-group">
                    <label class="col-xs-12 control-label line-checkTip"
                           :class="[emailCheck.check ? 'line-checkOk' : 'line-checkErr']">{{emailCheck.message}}</label>
                  </div>
                </div>
              </div>
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="form-group">
                    <label class="col-sm-6 control-label">Phone:</label>
                    <div class="col-sm-6">
                      <input type="text" v-model="phone" class="form-control"/>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <div class="form-group">
                    <label class="col-xs-12 control-label line-checkTip"
                           :class="[phoneCheck.check ? 'line-checkOk' : 'line-checkErr']">{{phoneCheck.message}}</label>
                  </div>
                </div>
              </div>
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="row">
                    <div class="col-sm-offset-6 col-sm-6">
                      <template v-if="isCanCommitInfo">
                        <button class="btn btn-info btn-flat" @click="commitInfoClick()">
                          <i class="fa fa-save"></i>
                          Save
                        </button>
                      </template>
                      <template v-else>
                        <button class="btn btn-info btn-flat" disabled>
                          <i class="fa fa-save"></i>
                          Save
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane" id="user_password_update">
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="form-group">
                    <label class="col-sm-6 control-label">Old Password:</label>
                    <div class="col-sm-6">
                      <input type="password" v-model="password" class="form-control"/>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <div class="form-group">
                    <label class="col-xs-12 control-label line-checkTip"
                           :class="[oldCheck.check ? 'line-checkOk' : 'line-checkErr']">{{oldCheck.message}}</label>
                  </div>
                </div>
              </div>
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="form-group">
                    <label class="col-sm-6 control-label">New Password:</label>
                    <div class="col-sm-6">
                      <input type="password" v-model="newPassword" class="form-control"/>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <div class="form-group">
                    <label class="col-xs-12 control-label line-checkTip"
                           :class="[newCheck.check ? 'line-checkOk' : 'line-checkErr']">{{newCheck.message}}</label>
                  </div>
                </div>
              </div>
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="form-group">
                    <label class="col-sm-6 control-label">Repeat Password:</label>
                    <div class="col-sm-6">
                      <input type="password" v-model="reNewPassword" class="form-control"/>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <div class="form-group">
                    <label class="col-xs-12 control-label line-checkTip"
                           :class="[reNewCheck.check ? 'line-checkOk' : 'line-checkErr']">{{reNewCheck.message}}</label>
                  </div>
                </div>
              </div>
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
                  <div class="row">
                    <div class="col-sm-offset-6 col-sm-6">
                      <template v-if="isCanCommit">
                        <button class="btn btn-info btn-flat" @click="commitClick()">
                          <i class="fa fa-save"></i>
                          Save
                        </button>
                      </template>
                      <template v-else>
                        <button class="btn btn-info btn-flat" disabled>
                          <i class="fa fa-save"></i>
                          Save
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import checkData from '../../helper/CheckData'
  import getData from '../../vuex/api/indexApi'
  import { mapGetters } from 'vuex'
  import xhrType from '../../vuex/api/xhrUrls'
  import messageBox from '../../components/msgbox'
  const tipMsg = [
    'Empty is not allowed.',
    'Space is not allowed.',
    'Minimal characters are not less than 6.',
    'Maximal characters are not more than 20.',
    'Characters are limited with 0-9,a-z,A-Z or !@#$&*.'
  ]
  const tipNameMsg = [
    'Empty is not allowed.',
    'Space is not allowed.',
    'Maximal characters are not more than 20.',
    'Characters are limited with 0-9,a-z,A-Z or !@#$&*.'
  ]
  const reTipMsg = 'Passwords are not matched.'
  const tipOkMsg = 'Success'

  export default {
    data () {
      return {
        loading: false,
        password: '',
        newPassword: '',
        reNewPassword: '',
        name: '',
        phone: '',
        email: '',
        oldCheck: {
          check: false,
          message: ''
        },
        newCheck: {
          check: false,
          message: ''
        },
        reNewCheck: {
          check: false,
          message: ''
        },
        nameCheck: {
          check: false,
          message: ''
        },
        phoneCheck: {
          check: false,
          message: ''
        },
        emailCheck: {
          check: false,
          message: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'app'
      ]),
      isCanCommit () {
        return this.oldCheck.check && this.newCheck.check && this.reNewCheck.check
      },
      isCanCommitInfo () {
        return this.nameCheck.check && this.emailCheck.check && this.phoneCheck.check
      }
    },
    methods: {
      commitInfoClick () {
        this.loading = true
        getData(xhrType.UPDATE_INFO, {
          name: this.name,
          email: this.email,
          phone: this.phone
        }).then(res => {
          this.loading = false
          if (res.data && res.data.code === 200) {
            messageBox.alert('Success')
          } else {
            messageBox.alert('Failed')
          }
        }, () => {
          this.loading = false
          messageBox.alert('Network Failure')
        })
      },
      commitClick () {
        this.loading = true
        getData(xhrType.UPDATE_PASSWORD, {
          // 跟后台一致
          oldPassword: this.password,
          password: this.newPassword
        }).then(res => {
          this.loading = false
          if (res.data && res.data.code === 200) {
            messageBox.alert('Success')
            this.password = ''
            this.newPassword = ''
            this.reNewPassword = ''
          } else {
            messageBox.alert('Failed')
          }
        }, () => {
          this.loading = false
          messageBox.alert('Network Failure')
        })
      },
      setReNewCheck (newPwd, reNewPwd) {
        let check = newPwd === reNewPwd
        this.reNewCheck.check = check
        if (check) {
          this.reNewCheck.message = tipOkMsg
        } else {
          this.reNewCheck.message = reTipMsg
        }
      }
    },
    watch: {
      app: {
        handler (value) {
          let user = value && value.user && value.user.user
          if (user) {
            this.loading = false
            this.name = user.name
            this.phone = user.phone
            this.email = user.email
          } else {
            this.loading = true
          }
        },
        deep: true
      },
      name (value) {
        let checkKey = checkData(value, 'notNull', 'notSpace', 'moreThan20', 'pwdReg')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.nameCheck.check = false
            this.nameCheck.message = tipNameMsg[i]
            return
          }
        }
        this.nameCheck.check = true
        this.nameCheck.message = tipOkMsg
      },
      email (value) {
        let checkKey = checkData(value, 'notNull', 'email')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.emailCheck.check = false
            this.emailCheck.message = ['Empty is not allowed.', 'Incorrect format.'][i]
            return
          }
        }
        this.emailCheck.check = true
        this.emailCheck.message = tipOkMsg
      },
      phone (value) {
        let checkKey = checkData(value, 'notNull', 'phone')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.phoneCheck.check = false
            this.phoneCheck.message = ['Empty is not allowed.', 'Incorrect format.'][i]
            return
          }
        }
        this.phoneCheck.check = true
        this.phoneCheck.message = tipOkMsg
      },
      password (value) {
        let checkKey = checkData(value, 'notNull', 'notSpace', 'moreThan6', 'moreThan20', 'pwdReg')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.oldCheck.check = false
            this.oldCheck.message = tipMsg[i]
            return
          }
        }
        this.oldCheck.check = true
        this.oldCheck.message = tipOkMsg
      },
      newPassword (value) {
        this.setReNewCheck(value, this.reNewPwd)
        let checkKey = checkData(value, 'notNull', 'notSpace', 'moreThan6', 'moreThan20', 'pwdReg')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.newCheck.check = false
            this.newCheck.message = tipMsg[i]
            return
          }
        }
        this.newCheck.check = true
        this.newCheck.message = tipOkMsg
      },
      reNewPassword (value) {
        this.setReNewCheck(this.newPassword, value)
      }
    }
  }
</script>
