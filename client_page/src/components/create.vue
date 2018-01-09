<template>
  <div class="layout_view row" ref="common">
    <div class="page" v-for="page of dataList" :style="getPage(page)">
      <template v-for="(key, k) of page.rectangle">
        <div :style="[getStyle(key, page), {background: key.color}]" @mousemove="key.isHover = true"
             @mouseout="key.isHover = false">
          <template v-if="choose" v-for="one of choose">
            <img :src="baseUrl + one.img"
                 v-if="one.img && one.self === k && one.links_self === key.links_self"
                 style="width: 100%; height: 100%;" :style="{background: '#ccc'}">
            <div v-if="!one.img && one.self === k && one.links_self === key.links_self"
                 style="width: 100px; height: 100px; border: 5px solid #ffa340; background: #000;
                 color:#fff;font-size: 80px;line-height: 100px; text-align: center;position: absolute;
                 left: 50%; top: 50%; margin-left: -50px; margin-top: -50px;">
              {{one.block_name}}
            </div>
          </template>
        </div>
      </template>
      <template v-for="(key, k) of page.textFrame">
        <div :style="[getStyle(key, page), {background: key.color}]" @mousemove="key.isHover = true"
             @mouseout="key.isHover = false">
          <template v-if="choose" v-for="one of choose">
            <template v-if="one.self === k && one.links_self === key.links_self && getText(one.text)">
              <p v-for="t of one.text" :style="{'font-size': t.fontSize + 'px'}">
                {{t.text.value}}
              </p>
            </template>
            <div v-if="one.self === k && one.links_self === key.links_self && !getText(one.text)"
                 style="width: 100px; height: 100px; border: 5px solid #ffa340; background: #000;
                 color:#fff;font-size: 80px;line-height: 100px; text-align: center;position: absolute;
                 left: 50%; top: 50%; margin-left: -50px; margin-top: -50px;">
              {{one.block_name}}
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import $ from '../plugins/jQuery/jquery-2.2.3.min'
  import { baseUrl } from '../config/config'
  export default {
    props: ['data', 'choose'],
    data () {
      return {
        baseUrl,
        dataList: []
      }
    },
    mounted () {
      this.dataList = this.data
    },
    methods: {
      getPage (page) {
        let width = page.width * page.pageCount
        let pageWidth = $(this.$refs.common).width() - 20
        $(this.$refs.common).height(page.height * pageWidth / width + 20)
        return {
          height: page.height + 'px',
          width: width + 'px',
          '-webkit-transform': `translate3d(-50%, -50%, 0) scale(${pageWidth / width})`,
          transform: `translate3d(-50%, -50%, 0) scale(${pageWidth / width})`
        }
      },
      getText (textObj) {
        for (let key of Object.keys(textObj)) {
          if (textObj[key].text) {
            return true
          }
        }
      },
      getStyle (key, data) {
        let oneObj = key.anchors
        let width = oneObj[2].x - oneObj[1].x
        let height = oneObj[1].y - oneObj[0].y
        let left = oneObj[0].x
        let top = oneObj[0].y
//        let left = oneObj[0].x
//        let top = (data.height / 2) + oneObj[0].y
//        if (!data.bindingLocation) {
//          left = oneObj[0].x + (data.width * data.pageCount / 2)
//        }
        return {
          width: width + 'px',
          height: height + 'px',
          left: left + 'px',
          top: top + 'px'
        }
      }
    }
  }
</script>
<style lang=scss rel=stylesheet/scss>
  .layout_view {

  }

  .layout_view .page {
    background: #ccc;
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: hidden;
  }

  .layout_view .page div {
    position: absolute;
  }
</style>
