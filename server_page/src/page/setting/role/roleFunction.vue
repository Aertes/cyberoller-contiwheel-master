<template>
  <div class="roleFunction">
    <div class="box box-default">
      <div class="overlay" v-if="loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="box-header with-border">
        <h3 class="box-title">Grant Permission</h3>
        <div class="box-tools pull-right">
          <a type="button" class="btn btn-box-tool"
             @click="closeInfo()">
            <i class="fa fa-times"></i>
          </a>
        </div>
      </div>
      <div class="box-body">
        <template v-for="menu of allFunc">
          <h4>{{menu.name}}</h4>
          <div class="form-horizontal row" v-for="menu2 of menu.child">
            <div class="col-xs-12" style="min-width: 300px">
              <div class="form-group">
                <div class="col-sm-12">
                  <div class="tag-model clearfix">
                    <div class="tag-model-check">
                      <span class="span">
                        <s-checkbox type="checkbox" v-model="menu2.isCheck"
                                    @change="changeMenu(arguments[0], menu2)"></s-checkbox>
                      </span>
                      <span class="span">
                        {{menu2.name}}
                      </span>
                    </div>
                    <template v-for="btn of menu2.child">
                      <div class="tag-model-check">
                      <span class="span">
                        <s-checkbox type="checkbox" v-model="btn.isCheck"
                                    @change="changeBtn(arguments[0], menu2)"></s-checkbox>
                      </span>
                        <span class="span">
                        {{btn.name}}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="box-footer">
        <a type="submit" class="btn btn-info btn-flat"
           @click="submit()">
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
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import messageBox from '../../../components/msgbox'
  export default {
    created () {
      this.searchAllFunction()
    },
    props: ['role'],
    data () {
      return {
        loading: false,
        allFunc: {}
      }
    },
    methods: {
      changeMenu (value, menu2) {
        if (!value) {
          for (let btnKey of Object.keys(menu2.child)) {
            menu2.child[btnKey].isCheck = false
          }
        }
      },
      changeBtn (value, menu2) {
        if (value) {
          menu2.isCheck = true
        }
      },
      submit () {
        let ids = []
        for (let key of Object.keys(this.allFunc)) {
          let isChild = false
          for (let menu2Key of Object.keys(this.allFunc[key].child)) {
            let menu2 = this.allFunc[key].child[menu2Key]
            if (menu2.isCheck) {
              ids.push(menu2Key)
              isChild = true
            }
            if (menu2.child) {
              for (let btnKey of Object.keys(menu2.child)) {
                let btn = menu2.child[btnKey]
                if (btn.isCheck) {
                  ids.push(btnKey)
                  isChild = true
                }
              }
            }
          }
          if (isChild) {
            ids.push(key)
          }
        }
        console.log(ids)
        getData(xhrUrls.ADD_ROLE_FUNC, {
          roleId: this.role.id,
          menusIds: ids.join(',')
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('ok')
            this.closeInfo()
          } else {
            messageBox.alert('err')
          }
        }, res => {
          console.log(res)
          messageBox.alert('err')
        })
      },
      closeInfo () {
        this.$emit('close')
      },
      searchAllFunction () {
        Promise.all([getData(xhrUrls.SEARCH_ROLE_FUNC, {
          roleId: this.role.id
        }), getData(xhrUrls.SEARCH_ROLE_FUNC)]).then(([roleFunc, allResFunc]) => {
          if (allResFunc.data.code === 200) {
            let roleMenus = {}
            for (let menu of roleFunc.data.data.menus) {
              roleMenus[menu.id] = menu
            }
            let menus = {}
            for (let menu of allResFunc.data.data.menus) {
              menu.isCheck = !!roleMenus[menu.id]
              menus[menu.id] = menu
            }
            for (let key of Object.keys(menus)) {
              let parentId = [menus[key].parent_id]
              if (menus[parentId]) {
                menus[parentId].child = menus[parentId].child || {}
                menus[parentId].child[key] = menus[key]
              }
            }
            let allFunc = {}
            for (let key of Object.keys(menus)) {
              let parentId = [menus[key].parent_id]
              if (!menus[parentId]) {
                allFunc[key] = menus[key]
              }
            }
            this.allFunc = allFunc
          } else {
            messageBox.alert('err')
          }
        }, ([roleFunc, allFunc]) => {
          console.log(roleFunc)
          console.log(allFunc)
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .roleFunction {
    .control-label {
      padding-top: 14px;
    }
    .tag-model {
      > div {
        float: left;
        margin: 5px 0;
        line-height: 34px;
        .span {
          float: left;
          display: inline-block;
          height: 34px;
        }
        .span + .span {
          margin-left: 10px;
        }
      }
      > div + div {
        margin-left: 15px;
      }
      .tag-close-btn {
        float: right;
        margin-right: 10px;
        .fa {
          cursor: pointer;
          font-size: 18px;
        }
        .fa:hover {
          color: #3c8dbc;
        }
      }
      .tag-model-check {
        .span {
          line-height: 30px;
        }
        .span + .span {
          margin-left: 20px;
          margin-right: 40px;
          line-height: 34px;
        }
      }
    }

    .tag-model:hover {
      background: rgba(238, 238, 238, 0.5);
    }
  }
</style>