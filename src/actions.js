
import tcomb from 'tcomb'
import { Model, MoveType } from 'types'
import Type from 'union-type'
import { allPass, append, assoc, apply, compose, concat, dissoc, drop, dropLast, equals, flatten, flip, head, identity, ifElse, isEmpty, last, lensIndex, lensProp, map, not, over, pipe, propEq, reverse, set, T as Any, take, view } from 'ramda'
import deal from 'deal'
import shuffle from 'shuffle'
import is from '@pwn/is'

const newTable = settings => {
  const table = deal(shuffle())
  return { ...settings, table, initTable: table }
}

// Lenses
// const subLens = lens => str => compose( lens, lensProp(str) )
// const table = lensProp( 'table' )
// const [  wasteHidden,  wasteVisible,  stock  ] =  map( subLens( table )
//     , [ 'wasteHidden','wasteVisible','stock' ])

const log = a => { console.log(a); return a }
const beep = new Audio( '/beep.mp3' )
const lensPath = compose( apply( compose ), map( ifElse( is.integer, lensIndex, lensProp )))
const len = propEq( 'length' )


// rank is defined differently on foundations and piles
const fRank = card => is.undefined(card) ? 0 : card[0]   // Foundation rank
const pRank = card => is.undefined(card) ? 14 : card[0]   // Pile rank
const suit = card => card[1]
const color = card => { return (
  { 'diamonds' : 'red'
  , 'hearts'   : 'red'
  , 'clubs'    : 'black'
  , 'spades'   : 'black'
  }[ suit(card) ]
)}
const isAce = card => Card.rank(card) === 1

//  -----------------------------------------------------------------  //


const Deal = model => () => newTable( model )
const Reset = model => () => assoc( 'table', model.initTable, model )


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

const Move2 = model => ( path, type: MoveType ) => {
  // console.log(path, type)
  const deselect = () => { beep.play(); return dissoc( 'selected', model ) }

  if( !path ) return model  // Block moving cards from stock that aren't top
  if( type === 'empty' && !model.selected ) return model         // Can't select empty pile
  if( !model.selected ) return assoc( 'selected', path, model )  // Select card

  const migrantPath = model.selected
  const occupantPath = path

  if( equals( migrantPath, occupantPath )) return deselect()          // Deselect on same card
  if( occupantPath[1] === 'wasteVisible' && migrantPath ) return deselect()  // Can't put a card on waste


  const migrantL           = lensPath( migrantPath )
  const migrantLocationL   = lensPath( dropLast(1, migrantPath ))
  const occupantL           = lensPath( occupantPath )
  const occupantLocationL   = lensPath( dropLast(1, occupantPath ))


  const migrant = view( migrantL, model )
  const occupant = view( occupantL, model )
  const migrantLocation = view( migrantLocationL, model )
console.log({ migrantPath, occupantPath, type, migrant, occupant })

  if( occupantPath[1] === 'foundations' ) {
    const validSuit = suit( migrant ) === suit( occupant || migrant )  // Compare only if occupant exists
    const validRank = fRank( migrant ) === fRank( occupant ) + 1
    if(!( validSuit && validRank )) return deselect()
  }

  if( occupantPath[1] === 'piles' ) {
    const validSuit = color( migrant ) !== color( occupant || migrant )  // Compare only if occupant exists
    const validRank = pRank( migrant ) === pRank( occupant ) - 1
    
    console.log('validSuit: ', validSuit, '  validRank: ', validRank )

    if( equals( migrantPath[2], occupantPath[2] )) return deselect()   // Deselect on same pile
    if(!( validSuit && validRank )) return deselect()
  }

  const migrantIdx =
  { 'wasteVisible' : migrantPath[2]
  , 'foundations'  : migrantPath[3]
  , 'piles'        : migrantPath[4]
  }[ migrantPath[ 1 ]]

  const pileHeight = view( migrantLocationL, model ).length
  const cardCount = pileHeight - migrantIdx

  return pipe
  ( dissoc( 'selected' )
  , over( occupantLocationL, flip(concat)( take( cardCount, migrantLocation )))      // Copy migrant to occupantLocation
  , over( migrantLocationL, dropLast( cardCount ))         // Drop from migrantLocation
  )( model )
}


const Result = Type({ Select: [], Deselect: [], Move: [], Continue: [] })
Result.prototype.map = function( fn ) {
  return Result.case(
  { Select: () => Result.Select()
  , Deselect: () => Result.Deselect()
  , Move: () => Result.Move()
  , Continue: Result.caseOn(
    { Select: () => Result.Select()
    , Deselect: () => Result.Deselect()
    , Move: () => Result.Move()
    , Continue: () => Result.Continue()
    })
  }
  , this )
}

const Move = model => ( path, type: MoveType ) => {
  const result = Result.Continue()
  const { Select, Deselect, Move, Continue } = Result

console.log(result)
  result
  .map(() => path ? Continue() : Deselect() )
  .map(() => type === 'empty' && !model.selected ? d : c )
  // .map(() => c )
  console.log(result)

  return model
}



const ShowHiddenPile = model => ( pileIdx ): Model => {
  const upturned   = lensPath([ 'table', 'piles', pileIdx, 'upturned' ])
  const downturned = lensPath([ 'table', 'piles', pileIdx, 'downturned' ])
  return pipe
  ( over( upturned, append( head( view( downturned, model ))))  // append downturned[0] to upturned
  , over( downturned, drop(1) )                                 // drop downturned[0]
  )( model )
}

const ShowHiddenWaste = model => (): Model => {
  const { wasteHidden, wasteVisible } = model.table
  const table =
  { ...model.table
  , wasteVisible: [ last( wasteHidden ) ]
  , wasteHidden: dropLast( 1, wasteHidden )
  }
  return { ...model, table }
}

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
, Move: [ Any, Any ]
, ShowHiddenPile: [ Number ]
, ShowHiddenWaste: []
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
, ShowHiddenPile
, ShowHiddenWaste
, Foundation
, Drop
, Undo
, ShowSettings
, UpdateSettings
}
