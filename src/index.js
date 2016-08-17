// @flow 
import { update as render } from 'yo-yo'
import Action from 'actions'
import { init, view } from 'app'
const log = x => console.log(x) || x

const update = ( model, action ) => action.value( action.args.length ? { model, ...action.args[0] } : model )

const instanceOf = type => msg =>
  type.isPrototypeOf( msg )

import { stream, scan, map } from 'flyd'
import filter from 'flyd/module/filter'

const action$ = stream()
const model$ = scan( update, init(), action$ ) // Contains the entire state of the application
// map( console.log, model$ )
const node$ = map( view( action$ ), model$ )  // Stream of DOM nodes to patch the document


const container = document.querySelector( '#container' )
scan( render, container, node$ )

import 'drag'