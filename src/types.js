import t, { irreducible, refinement, maybe, list, union, struct, tuple, enums, declare } from 'tcomb'
import { propEq, propSatisfies, gte as lte, all, allPass, where, addIndex, toString, isEmpty, equals, uniq, reduce, concat, values, compose, mergeWith, unnest, map, when, F, T } from 'ramda'


const len = propEq( 'length' )
const maxLen = x => propSatisfies( lte( x ), 'length' )
const allUniq = a => equals(a, uniq(a))

const Path = list( union([ t.String, t.Number, t.Boolean ]), 'Path' )

/*  Deck  */
const isRank = n => n >= 1 && n <= 14
const Rank = refinement( t.Number, isRank, 'Rank' )

const Suit = enums.of([ 'hearts', 'clubs', 'spades', 'diamonds' ], 'Suit' )

const Card = tuple([ Rank, Suit ], 'Card' )

const Deck = refinement
( t.list( Card )
, allPass(
	[ len( 52 )
	, allUniq
	])
, 'Deck' )


/*  Table  */
const Stock = t.refinement( list( Card ), maxLen( 52 ), 'Stock' )

const HiddenWaste = t.list( Card, 'HiddenWaste' )
const VisibleWaste = t.refinement( list( Card ), maxLen( 3 ), 'VisibleWaste' )

const Foundation = t.refinement( list( Card ), maxLen( 13 ), 'Foundation' )
const Foundations = t.refinement( list( Foundation ), len( 4 ), 'Foundations' )

const Subpile = refinement( list( Card ), maxLen( 52 ), 'Subpile' )
const Pile = t.interface({ downturned: Subpile, upturned: Subpile }, 'Pile' )
const Piles = refinement( list( Pile ), len( 7 ), 'Piles' )


const tableToDeck = ({ stock, wasteHidden, wasteVisible, foundations, piles }) =>
    unnest([ stock, wasteHidden, wasteVisible, unnest(foundations), unnest(map(compose(unnest,values), piles)) ])

const Table = refinement
( t.interface(
  { stock: Stock
  , wasteHidden: HiddenWaste
  , wasteVisible: VisibleWaste
  , foundations: Foundations
  , piles: Piles
  })
  // count of all cards must equal 52
, t => Deck(tableToDeck(t))
, 'Table' )

const InitTable = refinement( Table, where({
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
, table: maybe( Table )
, initTable: maybe( InitTable )
})


export
{ Path
, Card
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
