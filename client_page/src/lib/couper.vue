<template>
  <div class="imageCouperBox">
    <img id="imageCouper" :src="src" class="imageCouper"/>
    <div class="imageSub">
      <span @click="subCouper()" style="margin-right: 150px;background: #fff;padding: 10px 20px; cursor: pointer;">ok</span>
      <span @click="back()" style="background: #fff;padding: 10px 20px; cursor: pointer;">back</span>
    </div>
  </div>
</template>
<style lang="scss">
  .imageCouperBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 5000;
  }

  .imageCouper {
    width: 320px;
    height: 504px;
  }

  .imageSub {
    padding: 10px 20px;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }
</style>
<script>
  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.min.css'

  let cropper

  let dataURLtoBlob = dataurl => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = window.atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new window.Blob([u8arr], {
      type: mime
    })
  }

  export default {
    mounted () {
      setTimeout(() => {
        let image = document.getElementById('imageCouper')
        console.log(image)
        cropper = new Cropper(image, {
          aspectRatio: this.width / this.height,
          viewMode: 1,
          dragMode: 'move',
          guides: false,
          cropBoxMovable: false,
          cropBoxResizable: false,
          autoCropArea: 0.9
        })
      }, 100)
    },
    computed: {
      boxStyle () {
        let width = window.innerWidth * 0.7
        let height = width / 320 * 504
        return {
          width: `${width}px`,
          height: `${height}px`
        }
      }
    },
    methods: {
      subCouper () {
        let dataurl = cropper.getCroppedCanvas({
          width: this.width,
          height: this.height
        }).toDataURL('image/jpeg')
        let blob = dataURLtoBlob(dataurl)
        this.reFn && this.reFn(dataurl, blob)
        this.$destroy()
        this.$el.parentNode.removeChild(this.$el)
      },
      back () {
        this.$destroy()
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
</script>