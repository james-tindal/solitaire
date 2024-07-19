  
import tcomb from 'tcomb'
import { Model, MoveType } from 'types'
import Message from 'msg'
import { __, adjust, allPass, always, append, apply, assoc, assocPath, both, compose, concat, converge, cond, curry, dissoc, dissocPath, drop, dropLast, equals, flatten, flip, has, head, identity, ifElse, isEmpty, isNil, last, lens, lensIndex, lensPath, lensProp, lt as gt, map, mapObjIndexed, not, objOf, over, path, pathEq, pathSatisfies, propSatisfies, pipe, pipeK, prepend, prop, propEq, props, reverse, splitAt, subtract, take, takeLast, values, view, when } from 'ramda'
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
const log = a => console.log(a)||a
// const lensPath = compose( apply( compose ), map( ifElse( is.number, lensIndex, lensProp )))

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

// P = path
const getFromPathGetter = getter => diverge( compose( prepend('model'), getter ), path )
const migrantP = compose( concat([ 'table' ]), prop( 'migrantP' ))
const originP =  compose( dropLast(1), migrantP )
const occupantP = compose( concat([ 'table' ]), prop( 'occupantP' ))
const destinationP = compose( dropLast(1), occupantP )
const destination = getFromPathGetter( destinationP )
const origin = getFromPathGetter( originP )
const pileHeight = compose( prop('length'), origin )
const migrantIdx = pipe( migrantP, mPath => (
{ wasteVisible : mPath[2]
, foundations  : mPath[3]
, piles        : mPath[4]
}[ mPath[1] ]))
const cardCount = converge( subtract, [ pileHeight, migrantIdx ])
const movingStaying = converge( splitAt, [ cardCount, origin ])
const moveTo = compose( prop(1), destinationP )

const moveFrom = pathEq([ 'migrantP', 0 ])
const wasteNearlyEmpty = pathEq([ 'model', 'table', 'wasteVisible', 'length' ], 1 )
const wHiddenNotEmpty = pathSatisfies( gt(0), [ 'model', 'table', 'wasteHidden', 'length' ])
const showHiddenWaste = allPass([ moveFrom('wasteVisible'), wasteNearlyEmpty, wHiddenNotEmpty ])

const downturnedNotEmpty = pathEq([ 'model', 'table', 'wasteVisible', 'length' ], 1 )
const pileWillBeEmpty = converge( equals, [ compose( prop( 'length' ), origin ), cardCount ])
const showHiddenPile = allPass([ moveFrom('piles'), pileWillBeEmpty ])

const wasteHidden = path([ 'model', 'table', 'wasteHidden' ])
const wasteVisible = path([ 'model', 'table', 'wasteVisible' ])
const newWasteHidden = ifElse( showHiddenWaste, compose( dropLast(1), wasteHidden ), wasteHidden )
const newWasteVisible = ifElse( showHiddenWaste, compose( takeLast(1), wasteHidden ), wasteVisible )

const downturnedP = compose( adjust( always('downturned'), 3 ), originP )
const take1Downturned = compose( take(1), getFromPathGetter( downturnedP ))

const getValues = applySpec(
{ migrantP, migrantIdx, cardCount, originP, movingStaying, take1Downturned, showHiddenPile
, newWasteVisible, newWasteHidden, occupantP, destinationP, destination, moveTo, downturnedP, model: __ })


/* -- Validate move -- */

const moveToSameLocation = cancelIf
( compose( apply( equals ), props([ 'originP', 'destinationP' ])))

const dontMoveToWaste = cancelIf
( pathEq([ 'occupantP', 1 ], 'wasteVisible' ))

const onlyMoveOneToFoundation = cancelIf( both
( pathEq([ 'occupantP', 1 ], 'foundations' )
, propSatisfies( gt(1), 'cardCount' )
))

const rank = prop(0), suit = prop(1)
const topOccupant = compose( head, prop( 'destination' ))
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

const doMove = ({ destinationP, destination, movingStaying, downturnedP, showHiddenPile, take1Downturned, newWasteVisible, newWasteHidden, originP, model }) => compose
( over( lensPath([ 'table', 'piles' ]), values )  // coerce to array so it typechecks
, over( lensPath([ 'table', 'foundations' ]), values )  // coerce to array so it typechecks
, showHiddenPile
  ? compose( assocPath( originP, take1Downturned ), over( lensPath( downturnedP ), drop(1)))
  : identity
, assocPath( originP, movingStaying[1] )
, assocPath( destinationP, concat( movingStaying[0], destination ))
, assocPath( [ 'wasteHidden' ], newWasteVisible )
, assocPath( [ 'wasteVisible' ], newWasteHidden )
)( model )

const Move = pipe
( getValues
, Decision.of
, validateMove
, log
, cata(
  { MoveCard: doMove
  , Cancel: prop( 'model' )
  })
)


const Foundation = ({ model, path }) => 'dblclick'

const ShowSettings = model => {}
const UpdateSettings = model => {}
const Undo = ({ model, table }) => assoc( 'table', table, model )

export default Message(
{ Deal
, Reset: diverge( prop( 'initTable' ), assoc( 'table' ))
, Undo
, Draw
, Move
, Foundation
, ShowSettings
, UpdateSettings
})

