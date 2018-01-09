import Vue from 'vue'
import Resource from 'vue-resource'

Vue.use(Resource)
Vue.http.interceptors.push((request, next) => {
  if (!(request.url.indexOf('oss.xuhy.net') > 0)) {
    request.credentials = true
  }
  next()
})

const getDate = (urlObj, body, option) => {
  urlObj.bodyType = 'form'
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let url = urlObj.url
      if (urlObj.static) {
        url = urlObj.url
      }
      let type = urlObj.type || 'post'
      let options = option || {}
      if (urlObj.bodyType === 'form') {
        options.emulateJSON = true
      }
      if (type === 'get') {
        options.params = body
      }
      Vue.http[type](url, type === 'get' ? options : body, options).then(res => {
        if (res.bodyBlob.type === 'text/html') {
          try {
            res.data = JSON.parse(res.data)
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`%c JSON parse 异常`, 'color: #20a0ff; font-weight: bold')
            }
          }
        }
        console.log(res.data)
        resolve(res)
      }, res => {
        reject(res)
      })
    }, 1 * Math.random())
  })
}

export default getDate
