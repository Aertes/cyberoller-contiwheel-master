import $ from '../plugins/jQuery/jquery-2.2.3.min'
import DeCode from '../plugins/qrDeCode/index'
const colorList = ['#333', '#999', '#555', '#bbb']
let nowChoose = 0
export default {
  initDocument (layoutFrame, keyFrame, doDom) {
    return new Promise((resolve) => {
      let loadFrameLength = 0
      let loadFrame = () => {
        loadFrameLength++
        if (loadFrameLength > 1) {
          setTimeout(() => {
            let $layout = $(layoutFrame.contentWindow.window.document)
            let $key = $(keyFrame.contentWindow.window.document)
            let $layoutSvg = $($layout.find('object')[0].getSVGDocument())
            let $keySvg = $($key.find('object')[0].getSVGDocument())
            let keyMap = {}
            let $imageList = $keySvg.find('image')
            let chooseLength = 0
            // 添加标识
            let addTextToLayout = () => {
              if (chooseLength === $imageList.length) {
                $layoutSvg.find('image').each((index, dom) => {
                  if (keyMap[index]) {
                    $(dom).attr('keyData', keyMap[index].text)
                    doDom && doDom($(dom), keyMap[index])
                  }
                })
              }
            }
            // 识别二维码
            $imageList.each((index, dom) => {
              let urlList = dom.baseURI.split('/')
              urlList[urlList.length - 1] = dom.href.baseVal
              DeCode(urlList.join('/')).then(text => {
                chooseLength++
                keyMap[index] = {
                  text: text,
                  index: index,
                  url: urlList.join('/')
                }
                addTextToLayout()
              }, () => {
                chooseLength++
                addTextToLayout()
              })
            })
            resolve({
              width: $layout.width(),
              height: $layout.height()
            })
          }, 500)
        }
      }
      layoutFrame.onload = loadFrame
      keyFrame.onload = loadFrame
    })
  },
  createImg (imageUrl) {
    return new Promise((resolve, reject) => {
      let image = new window.Image()
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        ctx.fillStyle = colorList[nowChoose]
        nowChoose = nowChoose + 1 >= colorList.length ? 0 : nowChoose + 1
        ctx.fillRect(0, 0, image.width, image.height)
        try {
          resolve(canvas.toDataURL())
        } catch (err) {
          reject(err)
        }
      }
      image.src = imageUrl.replace('model', 'layout')
    })
  }
}
