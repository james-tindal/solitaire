  
import tcomb from 'tcomb'
import { Model, MoveType } from 'types'
import Message from 'msg'
import { __, allPass, always, append, apply, assoc, assocPath, both, compose, concat, converge, cond, curry, dissoc, dissocPath, drop, dropLast, equals, flatten, flip, has, head, identity, ifElse, isEmpty, isNil, last, lens, lensIndex, lensProp, lt as gt, map, mapObjIndexed, not, objOf, over, path, pathEq, propSatisfies, pipe, pipeK, prepend, prop, propEq, props, reverse, splitAt, subtract, T as otherwise, take, values, view } from 'ramda'
import { Tuple as Pair } from 'ramda-fantasy'
import { goldfinch } from 'fantasy-birds'
import deal from 'deal'
import shuffle from 'shuffle'
import is from 'is_js'
const isPlaceholder = has( '@@functional/placeholder' )
const applySpec = curry(( mapObj, src ) => mapObjIndexed
( ( v, k ) =>
    is.function( v ) ? v( src )
  : isPlaceholder( v ) ? prop( k, src )
  : v
, mapObj ))
const switchPath = ( p, caseObj ) =>
  over( lens( prop( p ), apply ), flip(path)( caseObj ))
// const diverge = ( getter, operator, setter ) =>
  // over( lens( getter, setter ), operator )
const diverge = ( getter, setter ) =>
  over( lens( getter, setter ), identity )
const log = ( a, b ) => { console.log(a,b);return a}
const lensPath = compose( apply( compose ), map( ifElse( is.integer, lensIndex, lensProp )))

const newTable = settings => {
  const table = deal(shuffle())
  return { ...settings, table, initTable: table }
}



//  -----------------------------------------------------------------  //


const Deal = model => newTable( model )
const Reset = model => assoc( 'table', model.initTable, model )


const Draw = ( model ): Model => {
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


//   const migrantL           = lensPath( migrant )
//   const migrantLocationL   = lensPath( dropLast(1, migrant ))
//   const occupantL           = lensPath( occupant )
//   const occupantLocationL   = lensPath( dropLast(1, occupant ))


//   const migrant = view( migrantL, model )
//   const occupant = view( occupantL, model )
//   const migrantLocation = view( migrantLocationL, model )

//   if( occupant[1] === 'foundations' ) {
//     const validSuit = suit( migrant ) === suit( occupant || migrant )  // Compare only if occupant exists
//     const validRank = fRank( migrant ) === fRank( occupant ) + 1
//     if(!( validSuit && validRank )) return deselect()
//   }

//   if( occupant[1] === 'piles' ) {
//     const validSuit = color( migrant ) !== color( occupant || migrant )  // broken hack
//     const validRank = pRank( migrant ) === pRank( occupant ) - 1
    

//     if( equals( migrant[2], occupant[2] )) return deselect()   // Deselect on same pile
//     if(!( validSuit && validRank )) return deselect()
//   }

// -------  Move  ------- //

const { Decision, cata,  Cancel,   MoveCard,  } =
require( 'decision' )([ 'Cancel', 'MoveCard' ])

const moveIf = ifElse( __, MoveCard.of, Decision.of )
const cancelIf = ifElse( __, Cancel.of, Decision.of )


const viewOccupant = compose( apply( path ), props([ 'occupantP', 'model' ]))
const viewMigrant = compose( apply( path ), props([ 'migrantP', 'model' ]))

const notKing = compose( always, not, propEq( 0, 13 ))

const destinationEmpty =
  flip( diverge( viewMigrant, compose( cancelIf, notKing )))
const destinationNonEmpty =
  flip( diverge( viewMigrant, compose( cancelIf, notKing )))

const switchEmpty = cond(
[ [ is.existy, destinationNonEmpty ]
, [ otherwise, destinationEmpty ]
])

const foundations = converge( switchEmpty, [ viewOccupant, identity ])
const piles = converge( switchEmpty, [ viewOccupant, identity ])

// When do we deselect? What are the rules?
// Move to empty
// ? Rank: 13             -- done
// : Same suit. Rank: +1

const validateMoveToDestination = switchPath([ 'occupant', 1 ], { foundations, piles })



const migrantIdx = migrant => (
{ wasteVisible : migrant[2]
, foundations  : migrant[3]
, piles        : migrant[4]
}[ migrant[1] ])
const migrantP = compose( concat([ 'table' ]), prop( 'migrantP' ))
const originP =  compose( dropLast(1), migrantP )
const occupantP = compose( concat([ 'table' ]), prop( 'occupantP' ))
const destP = compose( dropLast(1), occupantP )
const dest = diverge( compose( prepend('model'), destP ), path )
const getValues = applySpec(
{ migrantP, originP, occupantP, destP, dest, model: __ })


const getCardCount = applySpec(
{ model: __, destP: __, dest: __, originP: __, occupantP: __
, cardCount: ({ destP, originP, migrantP, model }) => {
    const origin = path( originP, model )
    const pileHeight = origin.length
    return pileHeight - migrantIdx( migrantP )
  }
})

const moveToSameLocation = cancelIf
( compose( apply( equals ), props([ 'originP', 'destP' ])))

const dontMoveToWaste = cancelIf
( pathEq([ 'occupantP', 1 ], 'wasteVisible' ))

const onlyMoveOneToFoundation = cancelIf( both
( pathEq([ 'occupantP', 1 ], 'foundations' )
, propSatisfies( gt(1), 'cardCount' )
))

// const validSuit = compose(  path([  ]))
// const validMoveToFoundation =
// // cancel unless
// // same suit
// // rank +1
// // if empty, must be ace

// // first, get 

const validateMove = pipeK
( moveToSameLocation
, dontMoveToWaste
, onlyMoveOneToFoundation
// , validMoveToFoundation

, MoveCard.of
)

const doMove = ({ destP, dest, originP, cardCount, model }): Model => {
  const origin = path( originP, model )
  const [ moving, staying ] = splitAt( cardCount, origin )

  return compose
  ( over( lensPath([ 'table', 'piles' ]), values )  // coerce to array so it typechecks
  , over( lensPath([ 'table', 'foundations' ]), values )  // coerce to array so it typechecks
  , assocPath( originP, staying )
  , assocPath( destP, concat( moving, dest ))
  )( model )
}

const Move = pipe
( getValues
, log
, getCardCount
, Decision.of
, validateMove
// , log
, cata(
  { MoveCard: doMove
  , Cancel: prop( 'model' )
  })
, x => console.log(x.table.foundations) || x
)



// Only allow 1 card at a time move to foundation


// -------  ShowHiddenPile  ------- //

const ShowHiddenPile = ({ model, pileIdx }): Model => {
  // console.log(model, pileIdx)
  const upturned   = lensPath([ 'table', 'piles', pileIdx, 'upturned' ])
  const downturned = lensPath([ 'table', 'piles', pileIdx, 'downturned' ])
  return pipe
  ( over( upturned, append( head( view( downturned, model ))))  // append downturned[0] to upturned
  , over( downturned, drop(1) )                                 // drop downturned[0]
  )( model )
}

const ShowHiddenWaste = ({ model }): Model => {
  const { wasteHidden, wasteVisible } = model.table
  const table =
  { ...model.table
  , wasteVisible: [ last( wasteHidden ) ]
  , wasteHidden: dropLast( 1, wasteHidden )
  }
  return { ...model, table }
}

const Foundation = ({ model, path }) => 'dblclick'

const Drop = model => dissoc( 'cardPath', model )
const Undo = model => {}
const ShowSettings = model => {}
const UpdateSettings = model => {}

export default Message(
{ Deal
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
})

