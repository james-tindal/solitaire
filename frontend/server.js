var path = require('path')
var express = require('express')
const PORT = process.argv[2] || 8000

var app = express()

app.use(express.static(__dirname + '/public'))

app.listen(PORT, 'localhost', function(err) {
  if (err) {
    console.log(err)
    return
  }

  console.log(`Listening at http://localhost:${PORT}`)
})
