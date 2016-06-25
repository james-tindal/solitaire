import t from 'tcomb'
import { propEq, propSatisfies, gte as lte, all, allPass, where, addIndex, isEmpty, equals, uniq, reduce, concat, values, compose, mergeWith, unnest, map, when, F, T } from 'ramda'


const len = propEq( 'length' )
const maxLen = x => propSatisfies( lte( x ), 'length' )
const allUniq = a => equals(a, uniq(a))


/*  Deck  */
const isRank = n => n >= 1 && n <= 14
const Rank = t.refinement( t.Number, isRank, 'Rank' )

const Suit = t.enums.of([ 'hearts', 'clubs', 'spades', 'diamonds' ], 'Suit' )

const Card = t.tuple([ Rank, Suit ], 'Card' )

const Deck = t.refinement
( t.list( Card )
, allPass(
	[ len( 52 )
	, allUniq
	])
, 'Deck' )


/*  Table  */
const Stock = t.refinement( t.list( Card ), maxLen( 52 ), 'Stock' )

const HiddenWaste = t.list( Card, 'HiddenWaste' )
const VisibleWaste = t.refinement( t.list( Card ), maxLen( 3 ), 'VisibleWaste' )

const Foundation = t.refinement( t.list( Card ), maxLen( 52 ), 'Foundation' )
const Foundations = t.refinement( t.list( Foundation ), len( 4 ), 'Foundations' )

const Subpile = t.refinement( t.list( Card ), maxLen( 52 ), 'Subpile' )
const Pile = t.interface({ downturned: Subpile, upturned: Subpile }, 'Pile' )
const Piles = t.refinement( t.list( Pile ), len( 7 ), 'Piles' )


const tableToDeck = ({ stock, wasteHidden, wasteVisible, foundations, piles }) =>
    unnest([ stock, wasteHidden, wasteVisible, unnest(foundations), unnest(map(compose(unnest,values), piles)) ])

const Table = t.refinement
( t.interface(
  { stock: Stock
  , wasteHidden: HiddenWaste
  , wasteVisible: VisibleWaste
  , foundations: Foundations
  , piles: Piles
  })
  // count of all props must equal 52
, t => Deck(tableToDeck(t))
, 'Table' )

// refactor with where
const InitTable = t.refinement( Table, where({
	stock: len( 24 )
, wasteHidden: len( 0 )
, wasteVisible: len( 0 )
, foundations: all( isEmpty )
, piles: addIndex(all)(( val, i ) => where({
    upturned: len( 1 )
  , downturned: len( i )
  }, val ))
}), 'InitTable' )

/*  Model  */
const Model = t.interface({
	draw3: t.Boolean
, table: Table
, initTable: InitTable
// , selected: $.Nullable( Lens )
})


/*  VDOM  */
const DomElement = t.irreducible( 'DomElement', x => x instanceof Element )
const SnabbData = t.struct({
})

const VNode = t.declare( 'VNode' )
VNode.define( t.struct({
	sel: t.String
,	data: SnabbData
, children: t.maybe( VNode )
, text: t.maybe( t.String )
, elm: DomElement
, key: t.Any
}))


export
{ Card
, Deck
, Stock
, HiddenWaste
, VisibleWaste
, Foundation
, Foundations
, Piles
, Pile
, Subpile
, HiddenWaste, VisibleWaste
, Table
, InitTable
, Model
}
