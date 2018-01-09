<template>
  <div>
    <div class="row animated fadeInUp">
      <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12">
        <div class="box box-default" style="max-height: 750px; min-height: 300px; overflow-y: auto; ">
          <div class="overlay" v-if="loading">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="box-body" v-if="orgList && orgList.length">
            <s-tree :data="orgList"
                    v-model="treeValue"
                    treeId="id"
                    title="org"
                    name="name"></s-tree>
          </div>
        </div>
      </div>
      <a-window>
        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12" v-if="treeValue.id">
          <div class="box box-default">
            <div class="box-header with-border">
              Edit {{fileName}}
            </div>
            <div class="box-body">
              <div class="form-group">
                <!--<div class="form-horizontal row">-->
                <!--<div class="col-xs-12">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">Status:</label>-->
                <!--<div class="col-sm-8">-->
                <!--<a class="btn btn-default btn-flat"-->
                <!--:disabled="editArea.isAvailable == 1"-->
                <!--@click="editArea.isAvailable == 0 && enable()">-->
                <!--<i class="fa fa-unlock"></i>Enable-->
                <!--</a>-->
                <!--<a class="btn btn-default btn-flat"-->
                <!--:disabled="editArea.isAvailable == 0"-->
                <!--@click="editArea.isAvailable == 1 && disable()">-->
                <!--<i class="fa fa-lock"></i>Disable-->
                <!--</a>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="col-xs-12 col-sm-4">-->
                <!--<div class="form-group">-->
                <!--&lt;!&ndash;<label class="line-checkTip control-label"&ndash;&gt;-->
                <!--&lt;!&ndash;:class="[editAreaCheck.orgName.check ? 'line-checkOk' : 'line-checkErr']"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;{{editAreaCheck.orgName.message}}&ndash;&gt;-->
                <!--&lt;!&ndash;</label>&ndash;&gt;-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <div class="form-horizontal row">
                  <div class="col-xs-12">
                    <div class="form-group">
                      <label class="col-sm-4 control-label">Name:</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" v-model="editArea.orgName"/>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-4">
                    <div class="form-group">
                      <!--<label class="line-checkTip control-label"-->
                      <!--:class="[editAreaCheck.orgName.check ? 'line-checkOk' : 'line-checkErr']"-->
                      <!--&gt;-->
                      <!--{{editAreaCheck.orgName.message}}-->
                      <!--</label>-->
                    </div>
                  </div>
                </div>
                <!--<div class="form-horizontal row">-->
                <!--<div class="col-xs-12">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">Type:</label>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="e_org_type_1" name="e_org_type"></s-checkbox>-->
                <!--agency-->
                <!--</div>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="e_org_type_2" name="e_org_type"></s-checkbox>-->
                <!--marketing-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="form-horizontal row">-->
                <!--<div class="col-xs-12">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">isDepartment:</label>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="e_cop_type_1" name="e_cop_type"></s-checkbox>-->
                <!--None Department-->
                <!--</div>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="e_cop_type_2" name="e_cop_type"></s-checkbox>-->
                <!--Department-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="form-horizontal row">-->
                <!--<div class="col-xs-12">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">EMail:</label>-->
                <!--<div class="col-sm-8">-->
                <!--<input type="text" class="form-control" v-model="editArea.email"/>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="col-xs-12 col-sm-4">-->
                <!--<div class="form-group">-->
                <!--&lt;!&ndash;<label class="line-checkTip control-label"&ndash;&gt;-->
                <!--&lt;!&ndash;:class="[editAreaCheck.orgName.check ? 'line-checkOk' : 'line-checkErr']"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;{{editAreaCheck.orgName.message}}&ndash;&gt;-->
                <!--&lt;!&ndash;</label>&ndash;&gt;-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="form-horizontal row">-->
                <!--<div class="col-xs-12 col-sm-8">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">上级机构:</label>-->
                <!--<div class="col-sm-8">-->
                <!--<input type="text" class="form-control" v-model="editArea.pareOrgId"/>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="col-xs-12 col-sm-4">-->
                <!--<div class="form-group">-->
                <!--<label class="line-checkTip">-->
                <!--&lt;!&ndash;:class="[productTypeDetailCheck.productCategoryCode.check ? 'line-checkOk' : 'line-checkErr']"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;{{productTypeDetailCheck.productCategoryCode.message}}&ndash;&gt;-->
                <!--</label>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <div class="form-horizontal row">
                  <div class="col-xs-12 col-sm-8">
                    <div class="row">
                      <div class="col-sm-offset-4 col-sm-8">
                        <a class="btn btn-info btn-flat" @click="canEdit && subEdit()" :disabled="!canEdit">
                          <i class="fa fa-save"></i>
                          Save
                        </a>
                        <div class="inline-tip pull-right" @click.stop>
                          <a class="btn btn-default btn-flat"
                             @click="subDelete()">
                            <i class="fa fa-remove"></i>Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box box-default">
            <div class="overlay" v-if="loading">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <div class="box-header with-border">
              Add {{fileName}}
            </div>
            <div class="box-body">
              <div class="form-horizontal row">
                <div class="col-xs-12">
                  <div class="form-group">
                    <label class="col-sm-4 control-label">Name:</label>
                    <div class="col-sm-8">
                      <input type="text" class="form-control" v-model="addArea.orgName"/>
                    </div>
                  </div>
                </div>
                <!--<div class="col-xs-12">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">Type:</label>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="org_type_1" name="org_type"></s-checkbox>-->
                <!--agency-->
                <!--</div>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="org_type_2" name="org_type"></s-checkbox>-->
                <!--marketing-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="col-xs-12">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">isDepartment:</label>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="cop_type_1" name="cop_type"></s-checkbox>-->
                <!--None Department-->
                <!--</div>-->
                <!--<div class="col-sm-4" style="margin-top: 5px;">-->
                <!--<s-checkbox v-model="cop_type_2" name="cop_type"></s-checkbox>-->
                <!--Department-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="col-xs-12">-->
                <!--<div class="form-group">-->
                <!--<label class="col-sm-4 control-label">EMail:</label>-->
                <!--<div class="col-sm-8">-->
                <!--<input type="text" class="form-control" v-model="addArea.email"/>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="col-xs-12 col-sm-4">-->
                <!--<div class="form-group">-->
                <!--&lt;!&ndash;<label class="line-checkTip control-label"&ndash;&gt;-->
                <!--&lt;!&ndash;:class="[addAreaCheck.orgName.check ? 'line-checkOk' : 'line-checkErr']">&ndash;&gt;-->
                <!--&lt;!&ndash;{{addAreaCheck.orgName.message}}&ndash;&gt;-->
                <!--&lt;!&ndash;</label>&ndash;&gt;-->
                <!--</div>-->
                <!--</div>-->
              </div>
              <div class="form-horizontal row">
                <div class="col-xs-12 col-sm-8">
                  <div class="row">
                    <div class="col-sm-offset-4 col-sm-8">
                      <a class="btn btn-default btn-flat" @click="canAdd && subAdd()" :disabled="!canAdd">
                        <i class="fa fa-plus"></i>
                        Save
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-window>
    </div>
  </div>
</template>
<script>
  import checkData from '../../../helper/CheckData'
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import messageBox from '../../../components/msgbox'
  const ERR_INPUT = 'Empty is not allowed.'
  const OK_MSG = ''
  export default {
    created () {
      this.searchOrgList()
      this.$watch('editArea.orgName', function (value) {
        let checkKey = checkData(value, 'notNull')
        this.editAreaCheck.orgName.check = checkKey[0]
        this.editAreaCheck.orgName.message = checkKey[0] ? OK_MSG : ERR_INPUT
      })
      this.$watch('addArea.orgName', function (value) {
        let checkKey = checkData(value, 'notNull')
        this.addAreaCheck.orgName.check = checkKey[0]
        this.addAreaCheck.orgName.message = checkKey[0] ? OK_MSG : ERR_INPUT
      })
      this.fileName = ['Document', 'Images', 'Video'][this.$route.params.id]
    },
    data () {
      return {
        fileName: '',
        treeAll: null,
        org_type_1: true,
        org_type_2: false,
        cop_type_1: true,
        cop_type_2: false,
        e_org_type_1: true,
        e_org_type_2: false,
        e_cop_type_1: true,
        e_cop_type_2: false,
        loading: false,
        orgList: [],
        treeValue: {},
        editArea: {
          orgId: '',
          orgName: '',
          pareOrgId: '',
          email: ''
        },
        editAreaCheck: {
          orgName: {
            check: false,
            message: ''
          }
        },
        addAreaCheck: {
          orgName: {
            check: false,
            message: ''
          }
        },
        addArea: {
          pareOrgId: '',
          orgName: '',
          email: ''
        }
      }
    },
    computed: {
      canAdd () {
        return this.addAreaCheck.orgName.check
      },
      canEdit () {
        return this.editAreaCheck.orgName.check
      }
    },
    methods: {
//      enable () {
//        getData(xhrUrls.ENABLE_ORG_INFO, {
//          id: this.editArea.orgId
//        }).then(res => {
//          console.log(res)
//          if (res.data.code === 200) {
//            messageBox.alert('成功')
//            this.searchOrgList()
//          } else {
//            messageBox.alert('失败')
//          }
//        }, res => {
//          console.log(res)
//          messageBox.alert('网络连接失败')
//        })
//      },
//      disable () {
//        getData(xhrUrls.DISABLE_ORG_INFO, {
//          id: this.editArea.orgId
//        }).then(res => {
//          console.log(res)
//          if (res.data.code === 200) {
//            messageBox.alert('成功')
//            this.searchOrgList()
//          } else {
//            messageBox.alert('失败')
//          }
//        }, res => {
//          console.log(res)
//          messageBox.alert('网络连接失败')
//        })
//      },
      subDelete () {
        messageBox.confirm('Confirm whether ?').then(() => {
          getData(xhrUrls.DELETE_IMAGE_TYPE_DISC, {
            id: this.editArea.orgId
          }).then(res => {
            console.log(res.data)
            if (res.data.code === 200) {
              messageBox.alert('Success')
              this.searchOrgList()
              this.treeValue = {}
            } else {
              messageBox.alert('Failed')
            }
          }, res => {
            console.log(res)
            messageBox.alert('Network Failure')
          })
        })
      },
      subEdit () {
        getData(xhrUrls.EDIT_IMAGE_TYPE_DISC, {
          id: this.editArea.orgId,
          name: this.editArea.orgName
        }).then(res => {
          console.log(res.data)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.searchOrgList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          messageBox.alert('Network Failure')
          console.log(res)
        })
      },
      subAdd () {
        getData(xhrUrls.ADD_IMAGE_TYPE_DISC, {
          name: this.addArea.orgName,
          parent_id: this.addArea.pareOrgId,
          type: 1
        }).then(res => {
          console.log(res.data)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.searchOrgList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          messageBox.alert('Network Failure')
        })
      },
      searchOrgList () {
        getData(xhrUrls.SEARCH_IMAGE_TYPE_DISC, {
          type: 1
        }).then(res => {
          if (res.data.code === 200) {
            let map = {}
            let tree = []
            let data = res.data.data.LableDiscs
            for (let key of data) {
              map[key.id] = key
              key.child = []
            }
            this.set = map
            for (let key of data) {
              if (key.parent_id === '-1') {
                tree.push(key)
              } else {
                map[key.parent_id].child.push(key)
              }
            }
            this.treeAll = tree
            this.orgList = [tree[this.$route.params.id]]
          }
        }, res => {
          console.log(res)
        })
      }
    },
    watch: {
      treeValue (value) {
        console.log(value)
        this.editArea = {
          orgId: value.id,
          orgName: value.name,
          pareOrgId: value.parent_id,
          isAvailable: value.isAvailable
        }
        this.e_org_type_1 = value.type === 'agency'
        this.e_org_type_2 = !this.e_org_type_1
        this.e_cop_type_1 = (value.flag === '1' || value.flag === 1)
        this.e_cop_type_2 = !this.e_cop_type_2
        this.addArea.pareOrgId = value.id
      },
      $route () {
        this.orgList = []
        this.treeValue = {}
        this.orgList = [this.treeAll[this.$route.params.id]]
        this.fileName = ['Document', 'Images', 'Video'][this.$route.params.id]
      }
    }
  }
</script>