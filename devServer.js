const { resolve } = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config')
const PORT = process.argv[2]

const app = express()
const compiler = webpack(config)

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))

app.use(express.static(__dirname + '/public'))

app.listen(PORT, 'localhost', err => {
  if (err) {
    console.log(err)
    return
  }

  console.log(`Listening at http://localhost:${PORT}`)
})
