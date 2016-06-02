import { curry, assoc } from 'ramda'
import Type from 'union-type'
import flyd, { map, merge, stream, scan } from 'flyd'
const patch = require('snabbdom').init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/eventlisteners'),
  require('snabbdom/modules/style'),
])
import h from 'snabbdom/h'
import { def, Model } from 'types'



// Initialise state
import shuffle from 'shuffle'
import deal from 'deal'
const newTable = model => {
  const table = deal(shuffle())
  return { ...model, table, initTable: table }
}

const init =
def( 'init', {}, [ Model ], () =>
  newTable({ draw3: true })
)

// Update
const Action = Type({
  Deal: []
, Reset: []
, Draw: []
, PickCard: []
, PutCard: []
, Undo: []
, ShowSettings: []
, UpdateSettings: []
})


const update = ( model, action ) => Action.case({
    Deal: () => newTable( model )
  , Reset: () => assoc( 'table', model.initTable, model )
  , Draw: () => {}
  , PickCard: cardPath => assoc( 'selectedCard', cardPath, model )  // set selectedCard to a lens / path  --  make ValidPath :: Type
  , PutCard: cardPath => {}
    // Maybe move selectedCard on top of cardPath
    // Check out Elm-effects/Redux-effects for beep sound side-effect
    // See if lenses are a suitable abstraction for pick and put
    
  , Undo: () => {}
  , ShowSettings: () => {}
  , UpdateSettings: () => {}
  }, action )

// View
import stock from 'stock'
import foundations from 'foundations'

const view = curry(( action$, model ) =>
  h( 'div.table', [
    // console.log(stock( table.stock )),
    foundations( model )

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


