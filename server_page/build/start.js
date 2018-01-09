var express = require('express')
var app = express()
app.use(express.static('dist'))
module.exports = app.listen(80, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + 80 + '\n')
})