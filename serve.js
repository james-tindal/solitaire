var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();

app.use(express.static(__dirname + '/public'))

app.listen(3003, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3003');
});
