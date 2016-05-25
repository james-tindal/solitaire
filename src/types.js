
import $ from 'sanctuary-def'
import { allPass, propEq, all, T } from 'ramda'


const def =
  $.create({
    checkTypes: DEBUG
  , env: $.env
  })

//    Rank :: Type
const Rank = $.NullaryType( 'Rank', x => typeof x == 'number' && x >= 1 && x <= 14 )

//    Suit :: Type
const Suit = $.EnumType([ 'hearts', 'clubs', 'spades', 'diamonds' ])

   // Card :: Type
const Card = $.Pair( Rank, Suit )

//    Deck :: Type
const Deck = $.NullaryType( 'Deck', allPass(
  [ Array.isArray
  , propEq( 'length', 52 )
  , all( $.test([], Card ) )
  ]))

//    Table :: Type
// const Table = $.RecordType({ stock: Card })

export default { def }