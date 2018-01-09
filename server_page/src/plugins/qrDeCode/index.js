/**
 * QRDecode
 */

import QRDecode from './decode'

export default imageUrl => {
  return new Promise((resolve, reject) => {
    let image = new Image()
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext("2d")
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0, image.width, image.height)
      let decode = new QRDecode()
      try {
        resolve(decode.decodeImageData(ctx.getImageData(0, 0, image.width, image.height), image.width, image.height))
      } catch (err) {
        reject(err)
      }
    }
    image.src = imageUrl
  })
}
