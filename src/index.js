import R , { T, F, propEq, __ } from 'ramda'
import Type from 'union-type'
import flyd, { map, merge, stream, scan } from 'flyd'
import keepwhen from 'flyd/module/keepwhen'
const patch = require('snabbdom').init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/eventlisteners'),
  require('snabbdom/modules/style'),
])
import h from 'snabbdom/h'


// Initialise state
// import shuffle from 'shuffle'
import deal from 'deal'
const init = () => deal()
// Update
const Action = Type({Increment: [], Decrement: [], Move: [ Object ], MouseDown: [], MouseUp: [], SetColour: [ String ]})

const update = (model, action) => Action.case({
    Increment: () => model + 1,
    Decrement: () => model - 1,
    Move: (a,b) => console.log(a,b),
    MouseDown: () => '',
    MouseUp: () => ''
  }, action )

// View
const view = R.curry(( action$, model ) =>
  h( 'div.table', [
    // stock(),
    // waste(),

    // foundation(),
    // foundation(),
    // foundation(),
    // foundation(),

    // pile(),
    // pile(),
    // pile(),
    // pile(),
    // pile(),
    // pile()
  ]))

// Streams

const action$ = stream() // All modifications to the state originate here
const model$ = flyd.scan( update, init(), action$ ) // Contains the entire state of the application
const vnode$ = flyd.map( view( action$ ), model$ ) // Stream of virtual nodes to render

flyd.map( console.log.bind(console), model$ )  // Uncomment to log state on every update

const container = document.getElementById( 'container' )
flyd.scan( patch, container, vnode$ )


