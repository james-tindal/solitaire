const webpack = require('webpack')
const { resolve } = require('path')
const { argv: flags } = require('yargs')

const production = 'p' in flags

module.exports =
{ entry: './src'
, devtool: production ? false : 'eval-source-map'
, output:
  { path: resolve( 'public' )
  , filename: 'build.js'
  , publicPath: ''
  }
, resolve:
  { root: resolve( 'src' )
  , extensions: [ '', '.js' ]
  }
, plugins: production
    ? [ new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })
      , new webpack.optimize.OccurenceOrderPlugin()
      , new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false }})
      ]
    : [ new webpack.DefinePlugin({ DEBUG: true })
      , new webpack.NoErrorsPlugin()
      ]
, module:
  { loaders:
    [ { test: /\.js$/
      , exclude: /node_modules/
      , loader: 'babel'
      }
    ]
  }
}
