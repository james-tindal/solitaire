
import tcomb from 'tcomb'
import { Model } from 'types'
import Type from 'union-type'
import { assoc, dissoc, isEmpty, compose, take, props, flatten, lensProp, reverse, drop, map, apply, pipe, concat, T as Any } from 'ramda'
import deal from 'deal'
import shuffle from 'shuffle'

const newTable = settings => {
  const table = deal(shuffle())
  return { ...settings, table, initTable: table }
}

// Lenses
const subLens = lens => str => compose( lens, lensProp(str) )
const table = lensProp( 'table' )
const [  wasteHidden,  wasteVisible,  stock  ] =  map( subLens( table )
    , [ 'wasteHidden','wasteVisible','stock' ])

//  -----------------------------------------------------------------  //


const Deal = model => () => newTable( model )
const Reset = model => () => assoc( 'table', model.initTable, model )

const log = a => { console.log(a); return a }

const Draw = model => (): Model => {
  const { stock, wasteHidden, wasteVisible } = model.table
  const table = isEmpty(stock)
  ? { ...model.table
    , stock: concat( wasteHidden, wasteVisible )
    , wasteHidden: []
    , wasteVisible: []
    }
	: { ...model.table
		, wasteHidden: concat( wasteHidden, wasteVisible )
    , wasteVisible: take( 3, stock )
    , stock: drop( 3, stock )
		}

  return { ...model, table }
}

const Move = model => path => {
  if( !path ) return model
  // if( model.selected ) return
  // move card from selected to path
  return assoc( 'selected', path, model )
}
// First, select a path
// Get next path and maybe move first on top of it

// If path[0] is 'waste', no select
// Compare cards to decide if valid move.


const Foundation = model => path => 'dblclick'
// Fuck this for now. enhancement.

const Drop = model => () => dissoc( 'cardPath', model )
const Undo = model => () => {}
const ShowSettings = model => () => {}
const UpdateSettings = model => () => {}


//  ------------------------------------------  //

export const Action = Type({
  Deal: []
, Reset: []
, Draw: []
, Move: [ Any ]
, Foundation: [ Any ]
, Drop: []
, Undo: []
, ShowSettings: []
, UpdateSettings: []
})

export const actions = {
	Deal
, Reset
, Draw
, Move
, Foundation
, Drop
, Undo
, ShowSettings
, UpdateSettings
}
