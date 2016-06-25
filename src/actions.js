
import tcomb from 'tcomb'
import { Model, Lens } from 'types'
import Type from 'union-type'
import { append, assoc, apply, compose, concat, dissoc, drop, dropLast, flatten, isEmpty, lensPath, lensProp, map, over, pipe, reverse, set, T as Any, take, view } from 'ramda'
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

const Move = model => ( path ): Model => {
  if( !path ) return model
  if( model.selected ) {

    const ap = apply( compose )
    const fromL         = ap( model.selected )
    const fromLocationL = ap( dropLast(1, model.selected ))
    const toL           = ap( path )
    const toLocationL   = ap( dropLast(1, path ))

    const from = view( fromL, model )
    const to = view( toL, model )
    const fromLocation = view( fromLocationL, model )

    // return over( locationL, append( from ), model )
    return pipe
    ( over( toLocationL, append( from ))
    , over( fromLocationL, drop(1) )
    )( model )


    return dissoc( 'selected', model )
    // get card from selected   /
    // append it to path        /
    // dissoc selected card     
  }

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
