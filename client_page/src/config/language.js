let lang = (navigator.browserLanguage || navigator.language).toLowerCase()
console.log(lang)
switch (lang) {
  case 'zh-cn':
    require('../assets/style/zh-cn.scss')
    break
  case 'ko-kr':
    require('../assets/style/ko-kr.scss')
    break
  case 'ja-jp':
    require('../assets/style/ja-jp.scss')
    break
  default:
}
