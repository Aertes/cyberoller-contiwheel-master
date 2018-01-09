<template>
  <div class="box box-default">
    <div class="overlay" v-if="loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <div class="box-header with-border">
      <h3 class="box-title">Add Size</h3>
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
            <label class="col-sm-6 control-label">Menu:</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="menu">
                <option value="71c1532212f211e790656c92bf3149c7">Promotion</option>
                <option value="d6a394fe12f211e790656c92bf3149c7">Retail/POSM</option>
              </s-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Material</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.p_id">
                <template v-for="mat of materialList">
                  <option :value="mat.id" v-if="menu == mat.p_id">{{mat.name}}</option>
                </template>
              </s-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Size Name:</label>
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
    'Maximal characters are not more than 40.'
  ]
  const tipOkMsg = 'Success'

  export default {
    created () {
      let check = {}
      Promise.all([getData(xhrUrls.SEARCH_MATERIAL_LIST, {
        page: 0,
        pageSize: 1000
      })]).then(([material]) => {
        this.materialList = material.data.data.pageInfo.rows
      })
      for (let key of (Object.keys(this.form))) {
        check[key] = {
          check: false,
          message: ''
        }
      }
      this.check = check
      this.$watch('form.name', function (value) {
        let checkKey = checkData(value, 'notNull', 'moreThan40')
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
    },
    methods: {
      closeInfo () {
        this.$emit('close')
      },
      submit () {
        this.loading = true
        getData(xhrUrls.ADD_SIZE_INFO, {
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
        for (let key of ['name']) {
          isSub = this.check[key].check ? isSub : this.check[key].check
        }
        return isSub
      }
    },
    data () {
      return {
        materialList: [],
        menu: '71c1532212f211e790656c92bf3149c7',
        loading: false,
        form: {
          name: '',
          p_id: ''
        },
        check: null
      }
    }
  }
</script>
