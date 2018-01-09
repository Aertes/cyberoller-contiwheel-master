<template>
  <div>
    <div class="box box-default">
      <div class="overlay" v-if="!detail">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="box-header with-border">
        <h3 class="box-title">Layout Detail</h3>
        <div class="box-tools pull-right">
          <a type="button" class="btn btn-box-tool"
             @click="close()">
            <i class="fa fa-times"></i>
          </a>
        </div>
      </div>
      <div class="box-body" v-if="detail">
        <div class="row">
          <div class="col-xs-4">
            <create :data="JSON.parse(detail.layout.html_path)" :bg="detail.layout.view_png"></create>
          </div>
          <div class="col-xs-4">
            <div class="form-group row">
              <label class="col-sm-4 control-label nowrap">Product:</label>
              <div class="col-sm-8">
                {{getDetailMap('productList', detail.layout.product)}}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 control-label nowrap">Material:</label>
              <div class="col-sm-8">
                {{getDetailMap('materialList', detail.layout.material)}}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 control-label nowrap">Size:</label>
              <div class="col-sm-8">
                {{getDetailMap('sizeList', detail.layout.size)}}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 control-label nowrap">Type:</label>
              <div class="col-sm-8">
                {{detail.layout.type}}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 control-label nowrap">Author:</label>
              <div class="col-sm-8">
                {{detail.layout.user_name}}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 control-label nowrap">Create Data:</label>
              <div class="col-sm-8">
                {{dateFormat(detail.layout.create_time)}}
              </div>
            </div>
          </div>
          <div class="col-xs-4">
            <div class="form-group row">
              <label class="col-sm-12 control-label nowrap">Adaptation Areas</label>
              <div class="col-sm-12" v-for="one of detail.defineAreas" style="line-height: 60px;">
                <span style="padding: 10px 15px; text-align: center; border: 1px solid #ccc;">
                  {{one.block_name}}
                </span>
                <span style="margin-left: 50px;">
                  {{one.area_type}}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8">
            <div class="row">
              <div class="col-sm-offset-6 col-sm-6">
                <a class="btn btn-default btn-flat" @click="edit()">
                  <i class="fa fa-edit"></i>
                  Edit
                </a>
                <a class="btn btn-default btn-flat" @click="deleteLayout()">
                  <i class="fa fa-remove"></i>
                  Delete
                </a>
                <a class="btn btn-default btn-flat" @click="close()">
                  <i class="fa fa-mail-reply"></i>
                  Back
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import create from './create.vue'
  import dateFormat from 'dateformat'
  import getData from '../../vuex/api/indexApi'
  import xhrUrls from '../../vuex/api/xhrUrls'
  import messageBox from '../../components/msgbox'
  export default {
    components: { create },
    props: ['productList', 'materialList', 'sizeList', 'id'],
    created () {
      this.getDetail()
    },
    methods: {
      deleteLayout () {
        messageBox.confirm('isDelete?').then(() => {
          getData(xhrUrls.DELETE_LAYOUT_INFO, {
            id: this.id
          }).then(res => {
            if (res.data.code === 200) {
              messageBox.alert('Success')
              this.searchImage()
            } else {
              messageBox.alert('Failed')
            }
          }, res => {
            messageBox.alert('Network Failure')
          })
        }, () => {
        })
      },
      dateFormat (value) {
        return dateFormat(new Date().setTime(value), 'yyyy-mm-dd HH:MM:ss')
      },
      close () {
        this.$emit('close')
      },
      edit () {
        this.$emit('edit')
      },
      getDetail () {
        getData(xhrUrls.SEARCH_LAYOUT_DETAIL, {
          id: this.id
        }).then(res => {
          if (res.data.code === 200) {
            this.detail = res.data.data
          }
        })
      },
      getDetailMap (key, id) {
        for (let one of this[key]) {
          if (one.id === id) {
            return one.name
          }
        }
      }
    },
    data () {
      return {
        detail: null
      }
    }
  }
</script>