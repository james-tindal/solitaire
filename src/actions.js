
import tcomb from 'tcomb'
import { Model, MoveType } from 'types'
import Type from 'union-type'
import { allPass, append, assoc, apply, compose, concat, dissoc, drop, dropLast, equals, flatten, flip, head, identity, ifElse, isEmpty, last, lensIndex, lensProp, map, not, over, pipe, propEq, reverse, set, T as Any, take, view } from 'ramda'
import deal from 'deal'
import shuffle from 'shuffle'
import is from '@pwn/is'
import Decision from 'decision'

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



const Move = model => ( path, type: MoveType ): Model => {
  const migrantPath = model.selected
  const occupantPath = path

  if( migrantPath ) {
    const migrantL            = lensPath( migrantPath )
    const migrantLocationL    = lensPath( dropLast(1, migrantPath ))
    const occupantL           = lensPath( occupantPath )
    const occupantLocationL   = lensPath( dropLast(1, occupantPath ))

    var migrant = view( migrantL, model )
    const occupant = view( occupantL, model )
    const migrantLocation = view( migrantLocationL, model )

    const migrantIdx =
    { 'wasteVisible' : migrantPath[2]
    , 'foundations'  : migrantPath[3]
    , 'piles'        : migrantPath[4]
    }[ migrantPath[ 1 ]]

    const pileHeight = migrantLocation.length
    const cardCount = pileHeight - migrantIdx
  }

  return Decision.Continue()
  .deselect( !path )          // Block moving cards from stock that aren't top
  .deselect( type === 'empty' && !model.selected )        // Can't select empty pile

  .select( !model.selected )                              // Select card

  .deselect( equals( migrantPath, occupantPath ))         // Same card. Deselect

  .deselect(() => occupantPath[1] === 'foundations' && do {
    const validSuit = suit( migrant ) === suit( occupant || migrant )  // Compare only if occupant exists
    const validRank = fRank( migrant ) === fRank( occupant ) + 1

    !validSuit || !validRank
  })

  .deselect(() => occupantPath[1] === 'piles' && do {
    const validSuit = color( migrant ) !== color( occupant || migrant )  // Compare only if occupant exists
    const validRank = pRank( migrant ) === pRank( occupant ) - 1
    
    console.log( 'validSuit: ', validSuit, '  validRank: ', validRank )

    equals( migrantPath[2], occupantPath[2] )   // Same pile. Deselect
    || !validSuit || !validRank
  })

  .move( true )

  .caseOn({
    Select: () => assoc( 'selected', path, model )
  , Deselect: () => { beep.play(); return dissoc( 'selected', model ) }
  , Move: () => pipe
    ( dissoc( 'selected' )
    , over( occupantLocationL, flip(concat)( take( cardCount, migrantLocation )))      // Copy migrant to occupantLocation
    , over( migrantLocationL, dropLast( cardCount ))         // Drop from migrantLocation
    )( model )
  })
}



const ShowHiddenPile = model => ( pileIdx ): Model => {
  const upturned   = lensPath([ 'table', 'piles', pileIdx, 'upturned' ])
  const downturned = lensPath([ 'table', 'piles', pileIdx, 'downturned' ])
  const topCard = head( view( downturned, model ))

  return pipe
  ( over( upturned, append( topCard ))  // copy top hidden card to upturned
  , over( downturned, drop(1) )         // drop from downturned
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
