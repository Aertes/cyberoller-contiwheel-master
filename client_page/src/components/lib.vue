<template>
  <div class="lib" style="padding: 20px; padding-left: 100px;">
    <div class="title line">
      Library
      <span style="
      float: right;
    background: #ffa340;
    font-size: 14px;
    margin-right: 20px;
    color: #000;
    margin-left: 30px;
    line-height: 30px;
    padding: 0 10px; cursor: pointer;"
            @click="searchImageBtn()">Search</span>
      <input type="text" class="form-control" style="display: inline-block; width: 250px;float: right;"
             v-model="keyWord">
    </div>
    <template v-for="one of list">
      <div class="select line" v-if="one.parent_id == -1">
        Please select:
        <span style="margin-left: 30px;" @click="created(tree[1])"
              :class="{active: one.id == '14039a7b118911e790656c92bf3149c7'}">
          <i class="fa fa-image"></i>
          Image
        </span>
        <span @click="created(tree[0])"
              :class="{active: one.id == '14021f6b118911e790656c92bf3149c7'}">
          <i class="fa fa-file-text-o"></i>
          Documents
        </span>
        <span @click="created(tree[2])"
              :class="{active: one.id == '1404bb5c118911e790656c92bf3149c7'}">
          <i class="fa fa-file-movie-o"></i>
          Videos
        </span>
      </div>
      <div class="item line" v-if="one.child && one.child.length">
        <span v-for="child of one.child" @click="created(child)" :class="{active: child.isCheck}">
          {{child.name}}
        </span>
      </div>
    </template>
    <div
      style="margin-top: 10px;    padding: 20px 20px 20px 100px; height: calc(100% - 312px);position: absolute; overflow-y: auto; left: 0; top: 312px; width: 100%;">
      <div class="row">
        <div class="col-xs-3">
          <div class="image_list_li"
               @click="clickImg(img)"
               v-if="index % 4 === 0"
               v-for="(img, index) of imageList">
            <img :src="baseUrl + (img.img_previwe || img.img_url)"
                 style="width: 100%;margin-bottom: 15px;">
          </div>
        </div>
        <div class="col-xs-3">
          <div class="image_list_li"
               @click="clickImg(img)"
               v-if="index % 4 === 1"
               v-for="(img, index) of imageList">
            <img :src="baseUrl + (img.img_previwe || img.img_url)"
                 style="width: 100%;margin-bottom: 15px;">
          </div>
        </div>
        <div class="col-xs-3">
          <div class="image_list_li"
               @click="clickImg(img)"
               v-if="index % 4 === 2"
               v-for="(img, index) of imageList">
            <img :src="baseUrl + (img.img_previwe || img.img_url)"
                 style="width: 100%;margin-bottom: 15px;">
          </div>
        </div>
        <div class="col-xs-3">
          <div class="image_list_li"
               @click="clickImg(img)"
               v-if="index % 4 === 3"
               v-for="(img, index) of imageList">
            <img :src="baseUrl + (img.img_previwe || img.img_url)"
                 style="width: 100%;margin-bottom: 15px;">
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="chooseFile"
           style="position: fixed; left: 0; width: 100%; height: 100%; overflow-y: auto; top: 0;background: rgba(0,0,0,0.8); z-index: 3000;">
        <div style="width: 100%">
          <div style="width: 400px;position: fixed;
          max-height: 500px;
          overflow-y: auto;
    top: 50%;
    left: 50%;
    padding-top: 10px;
    border: #ffa340 1px solid;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
background: #161616;">
            <div class="form-horizontal row">
              <div class="col-xs-12" style="min-width: 300px">
                <div class="form-group">
                  <label class="col-sm-4 control-label">Title:</label>
                  <div class="col-sm-8">
                    <label class="control-label">{{chooseFile.title}}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-horizontal row">
              <div class="col-xs-12" style="min-width: 300px">
                <div class="form-group">
                  <label class="col-sm-4 control-label">Category:</label>
                  <div class="col-sm-8">
                    <label class="control-label">{{chooseDom.name}}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-horizontal row">
              <div class="col-xs-12" style="min-width: 300px">
                <div class="form-group">
                  <label class="col-sm-4 control-label">Create Time:</label>
                  <div class="col-sm-8" style="text-align: left;">
                    <label class="control-label" style="text-align: left;">
                      {{chooseFile.create_time | date('yyyy-mm-dd HH:MM:ss')}}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-horizontal row">
              <div class="col-xs-12" style="min-width: 300px">
                <div class="form-group">
                  <label class="col-sm-4 control-label">Length:</label>
                  <div class="col-sm-8">
                    <label class="control-label">
                      {{(chooseFile.img_length ? chooseFile.img_length : 0 )+ 'MB'}}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-horizontal row">
              <div class="col-xs-12" style="min-width: 300px">
                <div class="form-group">
                  <label class="col-sm-4 control-label">Download:</label>
                  <div class="col-sm-8">
                    <label class="control-label" @click="openTab(chooseFile)" style="cursor: pointer;">
                      <a href="javascript:;">Click Download</a>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {{chooseDom.img_url}}
            <img :src="baseUrl + (chooseFile.img_previwe || chooseFile.img_url)"
                 style="width: 100%;margin-bottom: 15px;">
            <div style="font-size: 20px; position: absolute; right: 5px; top: 5px; cursor: pointer;z-index: 100;"
                 @click="chooseFile = null">
              <i class="fa fa-remove"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import xhrUrls from '../config/xhrUrls'
  import getData from '../config/indexApi'
  import { baseUrl } from '../config/config'
  export default{
    created () {
      this.getType()
    },
    data () {
      return {
        baseUrl,
        keyWord: '',
        chooseDom: null,
        map: null,
        list: null,
        tree: null,
        category: '',
        nowChoose: 1,
        imageList: [],
        chooseFile: null
      }
    },
    methods: {
      openTab (img) {
        window.open(baseUrl + '/product/information/download.json?fileName=' + img.img_url)
        return false
      },
      clickImg (img) {
//        window.open(img.img_url)
        console.log(img)
        this.chooseFile = img
      },
      getType () {
        getData(xhrUrls.SEARCH_IMAGE_TYPE).then(res => {
          if (res.data.code === 200) {
            let map = {}
            let tree = []
            let data = res.data.data.lableDisc
            for (let key of data) {
              map[key.id] = key
              key.child = []
              key.isCheck = false
            }
            this.set = map
            for (let key of data) {
              if (key.parent_id === '-1') {
                tree.push(key)
              } else {
                key.parent = map[key.parent_id]
                map[key.parent_id].child.push(key)
              }
            }
            this.tree = tree
            this.map = map
            this.created(this.tree[1])
          }
        }, res => {
          console.log(res)
        })
      },
      created (dom) {
        this.keyWord = ''
        this.clearMap()
        let childDom = this.findChild(dom)
        this.category = childDom.id
        this.chooseDom = childDom
        this.searchImage()
        this.list = this.getDomList(childDom)
        console.log(this.list)
      },
      findChild (dom) {
        if (dom.child.length) {
          return this.findChild(dom.child[0])
        } else {
          return dom
        }
      },
      clearMap () {
        for (let key of Object.keys(this.map)) {
          this.map[key].isCheck = false
        }
        this.list = [{
          parent_id: -1
        }]
        this.category = ''
      },
      getDomList (dom) {
        dom.isCheck = true
        if (dom.parent) {
          return [...this.getDomList(dom.parent), dom]
        } else {
          return [dom]
        }
      },
      searchImageBtn () {
        this.clearMap()
        this.searchImage()
      },
      searchImage ({ page = 1, count = 10000 } = {}) {
        getData(xhrUrls.SEARCH_IMAGE_LIST, {
          img_label: this.category,
          category: this.category,
          keyWord: this.keyWord,
          page: parseInt(page),
          pageSize: parseInt(count)
        }).then(res => {
          if (parseInt(page) === 1) {
            this.imageList = res.data.data.pageInfo.rows
          } else {
            this.imageList.push(...res.data.data.pageInfo.rows)
          }
          console.log(res)
        }, res => {
          console.log(res)
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  .lib {
    color: #ffa340;

    .line {
      border-bottom: 1px solid #fff;
    }

    .title {
      padding: 10px 0;
      font-size: 26px;
      font-weight: 900;
    }

    .select {
      font-size: 16px;
      padding: 10px 0;

      span {
        padding: 10px;
        background: #262626;
        cursor: pointer;
        width: 200px;
        vertical-align: middle;
        line-height: 50px;
        text-align: center;
        height: 70px;
        display: inline-block;

        .fa {
          color: #fff;
          font-size: 40px;
          margin-right: 30px;
        }

      }
      span.active {
        background: #fff;

        .fa {
          color: #262626;
        }

      }

    }
    .item {
      padding: 10px 0;

      span {
        margin-right: 20px;
        font-size: 14px;
        cursor: pointer;
        font-weight: 600;
      }

      span.active {
        color: #fff;
      }

    }

  }
</style>
