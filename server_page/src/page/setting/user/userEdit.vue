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
            <label class="col-sm-6 control-label">User Name:</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" v-model="form.name"/>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="form-group">
            <label class="col-xs-12 control-label line-checkTip"
                   :class="[check.name.check ? 'line-checkOk' : 'line-checkErr']">{{check.name.message}}</label>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Phone:</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" v-model="form.phone"/>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="form-group">
            <label class="col-xs-12 control-label line-checkTip"
                   :class="[check.phone.check ? 'line-checkOk' : 'line-checkErr']">{{check.phone.message}}</label>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">EMail:</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" v-model="form.email"/>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="form-group">
            <label class="col-xs-12 control-label line-checkTip"
                   :class="[check.email.check ? 'line-checkOk' : 'line-checkErr']">{{check.email.message}}</label>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Organization:</label>
            <div class="col-sm-6" style="position: relative;">
              <input type="text" class="form-control" v-model="form.org_name"
                     @focus="treeShow = true"
                     @blur="blur()"
              />
              <div
                style="position: absolute; top: 35px; left: 0; width: 100%; max-height: 300px; overflow-y: scroll;margin: 0 15px; background: #fff;">
                <s-tree :data="orgList"
                        v-show="treeShow"
                        v-model="treeValue"
                        treeId="id"
                        title="org"
                        name="name"></s-tree>
              </div>
            </div>
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
  const tipOkMsg = 'Success'

  export default {
    props: ['user'],
    mounted () {
      this.form.org_id = this.user.org_id
      this.form.id = this.user.id
      this.form.org_name = this.user.org_name
      this.form.name = this.user.name
      this.form.email = this.user.email
      this.form.phone = this.user.phone
    },
    created () {
      this.searchOrgList()
      let check = {}
      for (let key of (Object.keys(this.form))) {
        check[key] = {
          check: false,
          message: ''
        }
      }
      this.check = check
      this.$watch('form.name', function (value) {
        let checkKey = checkData(value, 'notNull', 'notSpace', 'moreThan6', 'moreThan20', 'pwdReg')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            console.log(this.check.name)
            this.check.name.check = false
            this.check.name.message = tipMsg[i]
            return
          }
        }
        this.check.name.check = true
        this.check.name.message = tipOkMsg
      })
      this.$watch('form.email', function (value) {
        let checkKey = checkData(value, 'notNull', 'email')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.check.email.check = false
            this.check.email.message = ['Empty is not allowed.', 'Incorrect format.'][i]
            return
          }
        }
        this.check.email.check = true
        this.check.email.message = tipOkMsg
      })
      this.$watch('form.phone', function (value) {
        let checkKey = checkData(value, 'notNull', 'phone')
        for (let i in checkKey) {
          if (!checkKey[i]) {
            this.check.phone.check = false
            this.check.phone.message = ['Empty is not allowed.', 'Incorrect format.'][i]
            return
          }
        }
        this.check.phone.check = true
        this.check.phone.message = tipOkMsg
      })
    },
    methods: {
      closeInfo () {
        this.$emit('close')
      },
      submit () {
        this.loading = true
        getData(xhrUrls.UPDATE_USER_INFO, {
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
      },
      searchOrgList () {
        getData(xhrUrls.SEARCH_ORG_LIST).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.orgList = res.data.data.org
          } else {
            console.log('error')
          }
        }, res => {
          console.log(res)
        })
      },
      blur () {
        setTimeout(() => {
          this.treeShow = false
        }, 100)
      }
    },
    computed: {
      isCanSub () {
        if (!this.check) {
          return false
        }
        let isSub = true
        for (let key of ['name', 'email', 'phone']) {
          isSub = this.check[key].check ? isSub : this.check[key].check
        }
        return isSub
      }
    },
    data () {
      return {
        loading: false,
        orgList: [],
        treeValue: {},
        treeShow: false,
        form: {
          id: '',
          org_id: '',
          org_name: '',
          name: '',
          email: '',
          phone: ''
        },
        check: null
      }
    },
    watch: {
      treeValue (value) {
        this.form.org_id = value.id
        this.form.org_name = value.name
      }
    }
  }
</script>