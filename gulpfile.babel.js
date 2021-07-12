import elixir from 'laravel-elixir'
import 'laravel-elixir-stylus'
import postStylus from 'poststylus'

elixir.config.assetsPath = '.'

elixir( mix => mix
  .stylus( 'style.styl'
         , null
         , { use: [ postStylus([ 'autoprefixer' ]) ]
           , url: { name: 'url', paths: [ './public/img' ], limit: false }       // inline images
           }
         )
)
