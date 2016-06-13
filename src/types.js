import t from 'tcomb'
import type { $Refinement } from 'tcomb'
import { propEq, propSatisfies, gte as lte, all, allPass, addIndex, isEmpty } from 'ramda'


const len = propEq( 'length' )
const maxLen = x => propSatisfies( lte( x ), 'length' )


/*  Deck  */
const isRank = n => n >= 1 && n <= 14
const Rank = t.refinement( t.Number, isRank, 'Rank' )

const Suit = t.enums.of([ 'hearts', 'clubs', 'spades', 'diamonds' ], 'Suit' )

const Card = t.tuple([ Rank, Suit ], 'Card' )

const Deck = t.refinement( t.list( Card ), len( 52 ), 'Deck' )


/*  Table  */

const Stock = t.refinement( t.list( Card ), maxLen( 52 ), 'Stock' )

const HiddenWaste = t.list( Card, 'HiddenWaste' )
const VisibleWaste = t.refinement( t.list( Card ), maxLen( 3 ), 'VisibleWaste' )

const Foundation = t.refinement( t.list( Card ), maxLen( 52 ), 'Foundation' )
const Foundations = t.refinement( t.list( Card ), len( 4 ), 'Foundations' )

const Subpile = t.refinement( t.list( Card ), maxLen( 52 ), 'Subpile' )
const Pile = t.interface({ downturned: Subpile, upturned: Subpile }, 'Pile' )
const Piles = t.refinement( t.list( Pile ), len( 7 ), 'Piles' )


const Table = t.interface({
  stock: Stock
, wasteHidden: HiddenWaste
, wasteVisible: VisibleWaste
, foundations: Foundations
, piles: Piles
}, 'Table' )

const InitTable = t.refinement( Table, allPass([
	propSatisfies( len( 24 ), 'stock' )
, propSatisfies( len( 0 ), 'wasteHidden' )
, propSatisfies( len( 0 ), 'wasteVisible' )
, propSatisfies( all( isEmpty ), 'foundations' )
, propSatisfies( all( propSatisfies( len( 1 ), 'upturned' )), 'piles' )
, propSatisfies( addIndex(all)(( val, i ) => propSatisfies( len( i ), 'downturned', val )), 'piles' )
]), 'InitTable' )

export { Deck, Table, InitTable }