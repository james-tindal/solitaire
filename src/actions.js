  
import tcomb from 'tcomb'
import { Model, MoveType } from 'types'
import Message from 'msg'
import { __, allPass, always, append, apply, assoc, assocPath, both, compose, concat, converge, cond, curry, dissoc, dissocPath, drop, dropLast, equals, flatten, flip, has, head, identity, ifElse, isEmpty, isNil, last, lens, lensIndex, lensProp, lt as gt, map, mapObjIndexed, not, objOf, over, path, pathEq, propSatisfies, pipe, pipeK, prepend, prop, propEq, props, reverse, splitAt, subtract, T as otherwise, take, values, view } from 'ramda'
import { apply as applyFn } from 'core.lambda'
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
const switchProp = ( p, caseObj ) =>
  over( lens( prop( p ), applyFn ), flip(prop)( caseObj ))
// const diverge = ( getter, transform, setter ) =>
  // over( lens( getter, setter ), transform )
const diverge = ( getter, setter ) =>
  over( lens( getter, setter ), identity )
const log = ( a, b ) => { console.log(a,b);return a}
const lensPath = compose( apply( compose ), map( ifElse( is.integer, lensIndex, lensProp )))

//  -----------------------------------------------------------------  //


const Deal = model => {
  const table = deal(shuffle())
  return { ...model, table, initTable: table }
}


const Draw = model => {
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


// -------  Move  ------- //

const { Decision, cata,  Cancel,   MoveCard,  } =
require( 'decision' )([ 'Cancel', 'MoveCard' ])

const moveIf = ifElse( __, MoveCard.of, Cancel.of )
const cancelIf = ifElse( __, Cancel.of, Decision.of )

const getFromPath = getter => diverge( compose( prepend('model'), getter ), path )
const migrantP = compose( concat([ 'table' ]), prop( 'migrantP' ))
const originP =  compose( dropLast(1), migrantP )
const occupantP = compose( concat([ 'table' ]), prop( 'occupantP' ))
const destP = compose( dropLast(1), occupantP )
const dest = getFromPath( destP )
const origin = getFromPath( originP )
const pileHeight = compose( prop('length'), origin )
const migrantIdx = pipe( migrantP, mPath => (
{ wasteVisible : mPath[2]
, foundations  : mPath[3]
, piles        : mPath[4]
}[ mPath[1] ]))
const cardCount = converge( subtract, [ pileHeight, migrantIdx ])
const movingStaying = converge( splitAt, [ cardCount, origin ])
const moveTo = compose( prop(1), destP )

const getValues = applySpec(
{ migrantP, migrantIdx, cardCount, originP, origin, movingStaying, pileHeight, occupantP, destP, dest, moveTo, model: __ })

const moveToSameLocation = cancelIf
( compose( apply( equals ), props([ 'originP', 'destP' ])))

const dontMoveToWaste = cancelIf
( pathEq([ 'occupantP', 1 ], 'wasteVisible' ))

const onlyMoveOneToFoundation = cancelIf( both
( pathEq([ 'occupantP', 1 ], 'foundations' )
, propSatisfies( gt(1), 'cardCount' )
))

const rank = prop(0), suit = prop(1)
const topOccupant = compose( head, prop( 'dest' ))
const topOccupantRank = compose( rank, topOccupant )
const topOccupantSuit = compose( suit, topOccupant )
const bottomMigrant = compose( last, path([ 'movingStaying', 0 ]))
const bottomMigrantRank = compose( rank, bottomMigrant )
const bottomMigrantSuit = compose( suit, bottomMigrant )

const fValidSuit = converge( equals, [ bottomMigrantSuit, topOccupantSuit ])
const fValidRank = converge( (a,b) => a == b+1, [ bottomMigrantRank, topOccupantRank ])
const foundations = ifElse
( compose( isNil, topOccupant )
, moveIf( compose( equals(1), bottomMigrantRank ))
, moveIf( both( fValidSuit, fValidRank ))
)

const color = flip(prop)(
{ hearts   : 'red'
, diamonds : 'red'
, spades   : 'black'
, clubs    : 'black'
})
const pValidSuit = converge( (a,b) => color(a) != color(b), [ bottomMigrantSuit, topOccupantSuit ])
const pValidRank = converge( (a,b) => a == b-1, [ bottomMigrantRank, topOccupantRank ])
const piles = ifElse
( compose( isNil, topOccupant )
, cancelIf( compose( not, equals(13), bottomMigrantRank ))
, moveIf( both( pValidSuit, pValidRank ))
)

const validateMove = pipeK
( moveToSameLocation
, dontMoveToWaste
, onlyMoveOneToFoundation
, switchProp( 'moveTo',
  { foundations
  , piles
  })
, MoveCard.of
)

const doMove = ({ destP, dest, movingStaying, originP, model }): Model => compose
( over( lensPath([ 'table', 'piles' ]), values )  // coerce to array so it typechecks
, over( lensPath([ 'table', 'foundations' ]), values )  // coerce to array so it typechecks
, assocPath( originP, movingStaying[1] )
, assocPath( destP, concat( movingStaying[0], dest ))
)( model )

const Move = pipe
( getValues
, Decision.of
, validateMove
, cata(
  { MoveCard: doMove
  , Cancel: prop( 'model' )
  })
)


// -------  ShowHiddenPile  ------- //

const ShowHiddenPile = ({ model, pileIdx }): Model => {
  const upturned   = lensPath([ 'table', 'piles', pileIdx, 'upturned' ])
  const downturned = lensPath([ 'table', 'piles', pileIdx, 'downturned' ])
  return pipe
  ( over( upturned, append( head( view( downturned, model ))))  // append downturned[0] to upturned
  , over( downturned, drop(1) )                                 // drop downturned[0]
  )( model )
}

const ShowHiddenWaste = ( model ): Model => {
  const { wasteHidden, wasteVisible } = model.table
  const table =
  { ...model.table
  , wasteVisible: [ last( wasteHidden ) ]
  , wasteHidden: dropLast( 1, wasteHidden )
  }
  return { ...model, table }
}

const Foundation = ({ model, path }) => 'dblclick'

const ShowSettings = model => {}
const UpdateSettings = model => {}
const Reset = diverge( prop( 'initTable' ), assoc( 'table' ))
const Undo = ({ model, table }) => assoc( 'table', table, model )

export default Message(
{ Deal
, Reset
, Undo
, Draw
, Move
, ShowHiddenPile
, ShowHiddenWaste
, Foundation
, ShowSettings
, UpdateSettings
})

