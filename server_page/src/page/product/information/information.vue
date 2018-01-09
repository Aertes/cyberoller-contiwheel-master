<template>
  <div>
    <div class="box box-default">
      <div class="overlay" v-if="loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="box-body">
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="control-label pull-left" style="margin-left: 30px;">Select Menu:</label>
              <div class="col-sm-6">
                <s-select :noSearch="true" v-model="menuId">
                  <option value="71c1532212f211e790656c92bf3149c7">Promotion</option>
                  <option value="d6a394fe12f211e790656c92bf3149c7">Retail/POSM</option>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="control-label pull-left" style="margin-left: 30px;">Select Product:</label>
              <div class="col-sm-6">
                <s-select :noSearch="true" v-model="productId">
                  <option value="0">- Select Product -</option>
                  <template v-for="pro of productList">
                    <option :value="pro.id">{{pro.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(tree, ind) of treeData[menuId]">
          <div @mouseover="tree.isHover = true" @mouseout="tree.isHover = false" :style="{
                      background: tree.isHover ? '#eee' : '#fff'
                    }">
            <div v-show="!tree.isEdit">{{tree.name || 'Empty'}}
              <p class="product_line product_btn" :style="{opacity: tree.isHover ? 100 : 0}">
                <span @click="tree.isEdit = true">Edit</span>
                <span @click="deleteLi(treeData[menuId], ind)">Remove</span>
                <span @click="moveLi(treeData, ind, -1)" v-if="ind != 0">Move Up</span>
                <span @click="moveLi(treeData, ind, 1)" v-if="ind != treeData.length - 1">Move Down</span>
              </p>
            </div>
            <input @mouseover.stop type="text" v-show="tree.isEdit" class="form-control" v-model="tree.name"
                   @blur="tree.isEdit = false">
          </div>
          <ul class="if2">
            <li v-for="(tree2,index) of tree.child">
              <div @mouseover="tree2.isHover = true" @mouseout="tree2.isHover = false" :style="{
                      background: tree2.isHover ? '#eee' : '#fff'
                    }">
                <div v-show="!tree2.isEdit">{{tree2.name || 'Empty'}}
                  <p class="product_btn product_line" :style="{opacity: tree2.isHover ? 100 : 0}">
                    <span @click="tree2.isEdit = true">Edit</span>
                    <span @click="deleteLi(tree.child, index)">Remove</span>
                    <span @click="moveLi(tree.child, index, -1)" v-if="index != 0">Move Up</span>
                    <span @click="moveLi(tree.child, index, 1)" v-if="index != tree.child.length - 1">Move Down</span>
                  </p>
                </div>
                <input @mouseover.stop type="text" v-show="tree2.isEdit" class="form-control" v-model="tree2.name"
                       @blur="tree2.isEdit = false">
              </div>
              <ul class="li3" v-if="tree2.child">
                <li v-for="(tree3, index2) of tree2.child">
                  <template v-if="tree3.type == 'text'">
                    <div @mouseover="tree3.isHover = true" @mouseout="tree3.isHover = false" style="position: relative;"
                         :style="{
                      background: tree3.isHover ? '#eee' : '#fff'
                    }">
                      <p v-show="!tree3.isEdit">
                        {{tree3.content || 'Empty'}}
                      </p>
                      <textarea @mouseover.stop v-show="tree3.isEdit" class="form-control" v-model="tree3.content"
                                @blur="tree3.isEdit = false"> </textarea>
                      <div v-show="tree3.isHover" class="product_btn" style="position: absolute; left: 0; top: 0;">
                        <span @click="tree3.isEdit = true"
                              style="background: #ffa13f;border: none; color: #fff;">Edit</span>
                        <span @click="deleteLi(tree2.child, index2)"
                              style="background: #ffa13f;border: none; color: #fff;">Remove</span>
                        <span @click="moveLi(tree2.child, index2, -1)" v-if="index2 != 0"
                              style="background: #ffa13f;border: none; color: #fff;">Move Up</span>
                        <span @click="moveLi(tree2.child, index2, 1)" v-if="index2 != tree2.child.length - 1"
                              style="background: #ffa13f;border: none; color: #fff;">Move Down</span>
                      </div>
                    </div>
                  </template>
                  <template v-if="tree3.type == 'img'">
                    <div v-for="(img,index) of tree3.images" style="margin-bottom: 10px;">
                      <div class="imageList clearfix" style="overflow: hidden;">
                        <div class="img">
                          <img style="width: 83px; height: 60px;"
                               :src="baseUrl + img.url" alt="">
                          <div class="closeImg" @click="closeImg(tree3.images, index)">
                            <i class="fa fa-close"></i>
                          </div>
                        </div>
                        <div>
                          <textarea style="float: left; width: 500px;" v-model="img.text"
                                    class="form-control"></textarea>
                        </div>
                      </div>
                    </div>
                    <div class="imageList clearfix">
                      <div class="img">
                        <div class="progress sm" v-if="tree3.loading != 0 && tree3.loading != 100">
                          <div class="progress-bar progress-bar-yellow"
                               :style="{ width: tree3.loading + '%' }"></div>
                        </div>
                        <span v-if="tree3.loading == 0 || tree3.loading == 100"
                              style="width: 83px; line-height: 60px; font-size: 50px; text-align: center; color: #ccc; position: relative;">
                        +
                        <input type="file"
                               style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                               @change="addFile(tree3, arguments[0])">
                      </span>
                      </div>
                    </div>
                  </template>
                </li>
                <li>
                  <div class="product_btn">
                    <span @click="addText(tree2.child)">Add Text</span>
                    <span @click="addImg(tree2.child)">Add Picture</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="product_btn">
                <span @click="addTitle(tree.child)">Add Subtitle</span>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <div class="product_btn" v-if="productId != 0">
            <span @click="addFirstTitle()">Add Attribute</span>
          </div>
        </div>
      </div>
      <div class="box-footer" v-if="productId != 0">
        <a type="submit" class="btn btn-info btn-flat"
           @click="save()">
              <span>
                <i class="fa fa-save"></i>
                Save
              </span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import messageBox from '../../../components/msgbox'
  import { baseUrl } from '../../../config/config'
  export default {
    created () {
      this.initProduct()
    },
    methods: {
      uploadImg (file, fn, list) {
        var formData = new window.FormData()
        formData.append('imgFile', file, file.name)
        getData(xhrUrls.UPLOAD_IMG, formData, {
          progress: event => {
            list.loading = event.loaded / event.total * 100
          }
        }).then(res => {
          if (res.data.code === 200) {
            console.log(res)
            fn & fn(res.data.data.url)
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      clearImg () {
        for (let tree of this.treeData[this.menuId]) {
          for (let tree2 of tree.child) {
            for (let tree3Index in tree2.child) {
              let tree3 = tree2.child[tree3Index]
              if (tree3.type === 'img' && !tree3.images.length) {
                tree2.child.splice(tree3Index, 1)
              }
            }
          }
        }
      },
      moveLi (list, index, add) {
        let li = list[index + add]
        list[index + add] = list[index]
        list[index] = li
      },
      save () {
        this.clearImg()
        let xhr = this.isNewContent ? xhrUrls.ADD_INFORMATION_INFO : xhrUrls.EDIT_INFORMATION_INFO
        getData(xhr, {
          product: this.productId,
          content: JSON.stringify(this.treeData),
          id: this.editId
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            if (this.isNewContent) {
              getData(xhrUrls.SEARCH_INFORMATION_INFO, {
                product: this.productId
              }).then(res => {
                this.loading = false
                if (res.data.data.productInformation) {
                  let content = JSON.parse(res.data.data.productInformation.content)
                  if (!content['71c1532212f211e790656c92bf3149c7']) {
                    content = {
                      '71c1532212f211e790656c92bf3149c7': content,
                      'd6a394fe12f211e790656c92bf3149c7': []
                    }
                  }
                  this.isNewContent = false
                  this.editId = res.data.data.productInformation.id
                  this.treeData = content
                } else {
                  this.editId = ''
                  this.isNewContent = true
                  this.treeData = {
                    '71c1532212f211e790656c92bf3149c7': [],
                    'd6a394fe12f211e790656c92bf3149c7': []
                  }
                }
              }, res => {
                this.loading = false
                console.log(res)
              })
            }
            messageBox.alert('Success')
            console.log(res)
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      deleteLi (list, index) {
        console.log(list)
        console.log(index)
        this.clearImg()
        list.splice(index, 1)
        console.log(list)
      },
      closeImg (list, index) {
        this.clearImg()
        list.splice(index, 1)
        console.log(list)
      },
      addTitle (list) {
        this.clearImg()
        list.push({
          name: '',
          isEdit: true,
          isHover: false,
          child: []
        })
      },
      addFirstTitle () {
        this.clearImg()
        console.log(this.treeData[this.menuId])
        this.treeData[this.menuId].push({
          name: '',
          isEdit: true,
          isHover: false,
          child: []
        })
      },
      addText (list) {
        this.clearImg()
        list.push({
          type: 'text',
          content: '',
          isEdit: true,
          isHover: false
        })
      },
      addImg (list) {
        this.clearImg()
        list.push({
          type: 'img',
          loading: 0,
          images: []
        })
      },
      addFile (list, event) {
        this.uploadImg(event.target.files[0], (url) => {
          list.images.push({
            url,
            text: ''
          })
        }, list)
      },
      initProduct () {
        this.loading = true
        getData(xhrUrls.SEARCH_PRODUCT_LIST, {
          page: 0,
          pageSize: 1000
        }).then(res => {
          this.productList = res.data.data.pageInfo.rows
          this.loading = false
        })
      }
    },
    watch: {
      productId (value) {
        if (value !== '0') {
          this.loading = true
          getData(xhrUrls.SEARCH_INFORMATION_INFO, {
            product: value
          }).then(res => {
            this.loading = false
            if (res.data.data.productInformation) {
              let content = JSON.parse(res.data.data.productInformation.content)
              if (!content['71c1532212f211e790656c92bf3149c7']) {
                content = {
                  '71c1532212f211e790656c92bf3149c7': content,
                  'd6a394fe12f211e790656c92bf3149c7': []
                }
              }
              this.isNewContent = false
              this.editId = res.data.data.productInformation.id
              this.treeData = content
            } else {
              this.editId = ''
              this.isNewContent = true
              this.treeData = {
                '71c1532212f211e790656c92bf3149c7': [],
                'd6a394fe12f211e790656c92bf3149c7': []
              }
            }
          }, res => {
            this.loading = false
            console.log(res)
          })
        }
      }
    },
    data () {
      return {
        baseUrl,
        loading: true,
        menuId: '',
        isNewContent: false,
        editId: '',
        productId: '0',
        productList: [],
        treeData: {
          '71c1532212f211e790656c92bf3149c7': [],
          'd6a394fe12f211e790656c92bf3149c7': []
        }
      }
    }
  }
</script>
<style>
  .if2 {
    margin-left: 20px;
  }

  .li3 {
    margin: 10px 0 10px 40px;
  }

  .li3 > li {
    margin-top: 10px;
  }

  /*.if2 > li > div:hover, .li3 > li > div:hover {*/
  /*background: #eee;*/
  /*}*/

  .product_line {
    height: 25px !important;
    display: inline-block;
    margin-left: 20px;
  }

  .product_btn {
    height: 50px;
  }

  .product_btn:hover {
    background: none !important;
  }

  .product_btn > span {
    height: 40px;
    line-height: 40px;
    padding: 5px 20px;
    border: 2px dashed #ccc;
    cursor: pointer;
    margin-right: 20px;
    font-size: 12px;
  }

  .product_btn > span:hover {
    border: 2px solid #ccc;
  }

  .imageList .img, .imageList span {
    display: block;
    width: 83px;
    height: 60px;
    position: relative;
    float: left;
    margin-right: 20px;
  }

  .imageList .img .closeImg {
    position: absolute;
    width: 20px;
    top: 0px;
    text-align: center;
    line-height: 20px;
    right: 0;
    background: #000;
    color: #fff;
    border-radius: 20px;
    cursor: pointer;
    height: 20px;
  }

  .imageList span {
    border: 2px dashed #ccc;
  }
</style>
