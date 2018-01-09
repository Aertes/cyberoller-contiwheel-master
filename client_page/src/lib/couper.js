import Vue from 'vue'
import Couper from './couper.vue'

let CouperConstructor = Vue.extend(Couper)
let couperVM

let showCouper = (fn, src, width, height) => {
  // base64(src).then(data => {
  //   console.log(data)
  couperVM = new CouperConstructor({
    el: document.createElement('div'),
    data () {
      return {
        src: src,
        reFn: fn,
        width,
        height
      }
    }
  })
  document.body.appendChild(couperVM.$el)
  // })
}

// let base64 = imageUrl => {
//   return new Promise((resolve, reject) => {
//     let image = new window.Image()
//     // let canvas = document.createElement('canvas')
//     // let ctx = canvas.getContext('2d')
//     image.onload = () => {
//       resolve(image)
//       // canvas.width = image.width
//       // canvas.height = image.height
//       // ctx.drawImage(image, 0, 0, image.width, image.height)
//       // resolve(ctx.getImageData(0, 0, image.width, image.height), image.width, image.height)
//     }
//     image.src = imageUrl
//   })
// }

export default showCouper
