<template>
  <div class="editor">
    <div ref="edit"></div>
  </div>
</template>
<script>
  let zIndex = 1000
  let reg = /(<span).*?>|<\/span>|<p><br><\/p>/g
  let $ = window.$
  let create = (dom) => {
    let $dom = $(dom)
    let array = []
    if ($dom.length) {
      for (let i = 0; i < $dom.length; i++) {
        let $one = $($dom[i])
        let obj = {
          dom: $one,
          font: $one[0].nodeType === 3 ? $one.parent().attr('face') : $one.attr('face'),
          value: $one.text()
        }
        if ($one[0].nodeName !== 'FONT' && $one.contents() && $one.contents().length) {
          obj.child = create($one.contents())
        }
        array.push(obj)
      }
    }
    return array
  }
  export default {
    props: ['value', 'placeholder'],
    data () {
      return {
        edit: null
      }
    },
    mounted () {
      // eslint-disable-next-line new-cap
      this.edit = new window.wangEditor(this.$refs.edit)
      this.edit.onchange = () => {
        // onchange 事件中更新数据
        let str = this.edit.$txt.html()
        str = str.replace(reg, '')
        this.$emit('input', { dom: create(str), value: this.edit.$txt.text() })
      }
      // 普通的自定义菜单
      this.edit.config.menus = [
        'fontfamily'
      ]
      this.edit.$editorContainer.css('z-index', zIndex--)
      this.edit.$editorContainer.blur(() => {
        console.log(123)
      })
      this.edit.$editorContainer.click(() => {
        if (this.edit.$txt.html().indexOf(this.placeholder) > 0) {
          this.edit.$txt.html('<p><br/></p>')
        }
      })
      this.edit.create()
      if (this.value && this.value.dom.html()) {
        this.edit.$txt.html('<p>' + this.value.dom.html() + '</p>')
        let str = this.edit.$txt.html()
        str = str.replace(reg, '')
        this.$emit('input', { dom: create(str), value: this.edit.$txt.text() })
      } else {
        this.edit.$txt.html('<p>' + this.placeholder + '</p>')
      }
    }
  }
</script>
<style lang="scss" type="text/scss">
  .editor {
    p {
      span {
        background: none !important;
      }
      margin: 0 !important;
      font[face='Continental Stag Sans'] {
        background: #99ccff !important;
      }
      font[face=方正兰亭黑简体] {
        background: #6699FF !important;
      }
      font[face=方正大标宋繁体] {
        background: #666699 !important;
      }
      font[face='A-OTF Gothic MB101 Pro'] {
        background: #FFCCCC !important;
      }
      font[face='Nanum Gothic'] {
        background: #CC3399 !important;
      }
    }
    .wangEditor-menu-container {
      background-color: #ffa340;
    }
    .wangEditor-container {
      background-color: #ffa340;
      border: 1px solid #181818;
    }
    .wangEditor-menu-container .menu-item .active, .wangEditor-menu-container .menu-item:hover {
      background-color: inherit;
    }
    .wangEditor-drop-list {
      background-color: #000;
      border: 1px solid #ffa340;
      box-shadow: none;
    }
    .wangEditor-drop-list a:hover {
      background-color: #ddd;
    }
  }
</style>
