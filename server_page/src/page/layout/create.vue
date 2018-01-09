<template>
  <div class="layout_view row" ref="common">
    <div class="page" v-for="page of dataList" :style="getPage(page)">
      <div class="create_bg">
        <img v-if="bg" :src="baseUrl + bg" alt="">
      </div>
      <template v-for="key of page.rectangle">
        <div :style="[getStyle(key, page), {background: key.color}]" @mousemove="key.isHover = true"
             @click="key.click && key.click(key.links_self)"
             @mouseout="key.isHover = false">
          <div v-if="key.name"
               style="width: 100px; height: 100px; border: 5px solid #ffa340; background: #000;
                 color:#fff;font-size: 80px;line-height: 100px; text-align: center;position: absolute;
                 left: 50%; top: 50%; margin-left: -50px; margin-top: -50px;">
            {{key.name}}
          </div>
        </div>
      </template>
      <template v-for="key of page.textFrame">
        <div :style="[getStyle(key, page), {background: key.color}]" @mousemove="key.isHover = true"
             @click="key.click && key.click(key.links_self)"
             @mouseout="key.isHover = false">
          <div v-if="key.name"
               style="width: 100px; height: 100px; border: 5px solid #ffa340; background: #000;
                 color:#fff;font-size: 80px;line-height: 100px; text-align: center;position: absolute;
                 left: 50%; top: 50%; margin-left: -50px; margin-top: -50px;">
            {{key.name}}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import $ from '../../plugins/jQuery/jquery-2.2.3.min'
  import { baseUrl } from '../../config/config'
  export default {
    props: ['data', 'bg'],
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
      getStyle (key, data) {
        let oneObj = key.anchors
        let width = oneObj[2].x - oneObj[1].x
        let height = oneObj[1].y - oneObj[0].y
        let left = oneObj[0].x
        let top = oneObj[0].y
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
    position: relative;
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

  .create_bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .create_bg > img {
    width: 100%;
    height: 100%;
  }
</style>