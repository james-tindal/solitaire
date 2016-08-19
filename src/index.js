// @flow 
import { update as render } from 'yo-yo'
import Action from 'actions'
import { init, view } from 'app'
import detectWin from 'detect-win'
import handleUndo from 'undo'
import t from 'tcomb'
import { Model } from 'types'

const update = ( model, action ) => action.value( action.args.length ? { model, ...action.args[0] } : model )

import { stream, scan, map, on } from 'flyd'
import filter from 'flyd/module/filter'

const action$ = stream( Action.Deal() )
const model$ = scan( update, init(), action$ ) // Contains the entire state of the application
const node$ = map( view(action$), model$ )  // Stream of DOM nodes to patch the document

const container = document.querySelector( '#container' )
scan( render, container, node$ )

// map( detectWin(action$), model$ )

DEBUG && do {
  on( x => console.log(x.value.name), action$ )      // log model
  on( console.log, model$ )      // log model
  on( (x:Model) => x, model$ )     // model$ always contains a valid model
  require( 'devtools-formatters' )
}
handleUndo( action$, model$ )
