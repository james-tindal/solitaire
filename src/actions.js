  
import tcomb from 'tcomb'
import { Model, MoveType } from 'types'
import Message from 'msg'
import { __, allPass, always, append, apply, assoc, assocPath, compose, concat, converge, cond, curry, dissoc, dissocPath, drop, dropLast, equals, flatten, flip, has, head, identity, ifElse, isEmpty, isNil, last, lens, lensIndex, lensProp, map, mapObjIndexed, not, objOf, over, path, pathEq, pathSatisfies, pipe, pipeK, prop, propEq, props, reverse, splitAt, subtract, T as Any, T as otherwise, take, values, view } from 'ramda'
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

// const Move = model => ( path, type: MoveType ) => {
//   // console.log(path, type)
//   const deselect = () => { beep.play(); return dissoc( 'selected', model ) }

//   if( type === 'empty' && !model.selected ) return model         // Can't select empty pile
//   if( !model.selected ) return assoc( 'selected', path, model )  // Select card

//   const migrant = model.selected
//   const occupant = path

//   if( equals( migrant, occupant )) return deselect()          // Deselect on same card
//   if( occupant[1] === 'wasteVisible' && migrant ) return deselect()  // Can't put a card on waste


//   const migrantL           = lensPath( migrant )
//   const migrantLocationL   = lensPath( dropLast(1, migrant ))
//   const occupantL           = lensPath( occupant )
//   const occupantLocationL   = lensPath( dropLast(1, occupant ))


//   const migrant = view( migrantL, model )
//   const occupant = view( occupantL, model )
//   const migrantLocation = view( migrantLocationL, model )
// console.log({ migrant, occupant, type, migrant, occupant })

//   if( occupant[1] === 'foundations' ) {
//     const validSuit = suit( migrant ) === suit( occupant || migrant )  // Compare only if occupant exists
//     const validRank = fRank( migrant ) === fRank( occupant ) + 1
//     if(!( validSuit && validRank )) return deselect()
//   }

//   if( occupant[1] === 'piles' ) {
//     const validSuit = color( migrant ) !== color( occupant || migrant )  // broken hack
//     const validRank = pRank( migrant ) === pRank( occupant ) - 1
    
//     console.log('validSuit: ', validSuit, '  validRank: ', validRank )

//     if( equals( migrant[2], occupant[2] )) return deselect()   // Deselect on same pile
//     if(!( validSuit && validRank )) return deselect()
//   }

//   const migrantIdx =
//   { 'wasteVisible' : migrant[2]
//   , 'foundations'  : migrant[3]
//   , 'piles'        : migrant[4]
//   }[ migrant[ 1 ]]

//   const pileHeight = view( migrantLocationL, model ).length
//   const cardCount = pileHeight - migrantIdx

//   return pipe
//   ( dissoc( 'selected' )
//   , over( occupantLocationL, flip(concat)( take( cardCount, migrantLocation )))      // Copy migrant to occupantLocation
//   , over( migrantLocationL, dropLast( cardCount ))         // Drop from migrantLocation
//   )( model )
// }


// -------  Move  ------- //

const { Complete,   Select,   Deselect,   MoveCard, Decision, cata } = require( 'decision-monad' )
    ([ 'Complete', 'Select', 'Deselect', 'MoveCard' ])


const deselectIf = ifElse( __, Deselect.of, Decision.of )
const selectIf = ifElse( __, Select.of, Decision.of )

const completeIf = ( isComplete, transform = identity ) => ifElse
( isComplete
, compose( Complete.of, transform )
, Decision.of )

const dontSelectEmptyPile = completeIf
( x => x.empty && isNil( x.model.selected ))

const getMigrant = compose( concat([ 'model', 'table' ]), path([ 'model', 'selected' ]))
const getOccupant = compose( concat([ 'model', 'table' ]), prop( 'path' ))

const migrantOccupant = compose( Decision.of, applySpec(
{ migrantP: getMigrant
, originP: compose( dropLast(1), getMigrant )
, occupantP: getOccupant
, destP: compose( dropLast(1), getOccupant )
, model: __
}))

const moveToSameLocation = deselectIf
( compose( apply( equals ), props([ 'originP', 'destP' ])))

const dontMoveToWaste = deselectIf
( pathEq([ 'occupant', 0 ], 'wasteVisible' ))

const viewOccupant = compose( apply( path ), props([ 'occupantP', 'model' ]))
const viewMigrant = compose( apply( path ), props([ 'migrantP', 'model' ]))

const notKing = compose( always, not, propEq( 0, 13 ))

const destinationEmpty =
  flip( diverge( viewMigrant, compose( deselectIf, notKing )))
const destinationNonEmpty =
  flip( diverge( viewMigrant, compose( deselectIf, notKing )))

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


const validateMove = pipeK
( dontSelectEmptyPile
, selectIf( pathSatisfies( isNil, [ 'model', 'selected' ]))
, migrantOccupant
, moveToSameLocation
, dontMoveToWaste
// Split. Move to foundations or piles ?
// , validateMoveToDestination
, MoveCard.of
)

const migrantIdx = migrant => (
{ wasteVisible : migrant[3]
, foundations  : migrant[4]
, piles        : migrant[5]
}[ migrant[2] ])

const Move = x => console.log(x)
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

