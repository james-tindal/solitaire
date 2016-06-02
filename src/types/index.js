
import $ from 'sanctuary-def'
import { allPass, curry, propEq, all, propSatisfies, gte as lte, or, equals, isEmpty, addIndex } from 'ramda'

const def =
  $.create({
    checkTypes: DEBUG
  , env: $.env
  })

//  K :: a -> b -> a
var K = function(x) { return function(y) { return x; }; };
//  Nullable :: Type -> Type
const Nullable = $.UnaryType(
  'Nullable',
  K(true),
  function(nullable) { return nullable === undefined ? [] : [nullable]; }
)

const test = type => x => $.test([], type, x )

const Ary = type => allPass(
  [ Array.isArray
  , all( test( type ))
  ])

const len = propEq( 'length' )
const maxLen = x => propSatisfies( lte( x ), 'length' )

/*  Cards  */
const Rank = $.NullaryType( 'Rank', x => typeof x == 'number' && x >= 1 && x <= 14 )

const Suit = $.EnumType([ 'hearts', 'clubs', 'spades', 'diamonds' ])

const Card = $.Pair( Rank, Suit )

const Deck = $.NullaryType( 'Deck', allPass([ len( 52 ), Ary( Card )]))

const Stock = $.NullaryType( 'Stock', allPass([ maxLen( 52 ), Ary( Card )]))

const Waste = $.NullaryType( 'Waste', allPass([ maxLen( 3 ), Ary( Card )]))

const Foundation = $.NullaryType( 'Foundation', allPass([ maxLen( 52 ), Ary( Card )]))
const Foundations = $.NullaryType( 'Foundations', allPass([ len( 4 ), all( test( Foundation ))]))

const Subpile = $.NullaryType( 'Pile', allPass([ maxLen( 52 ), Ary( Card )]))
const Pile = $.RecordType({ downturned: Subpile, upturned: Subpile })
const Piles = $.NullaryType( 'Piles', allPass([ len( 7 ), all( test( Pile ))]))

const Table = $.RecordType({ stock: Stock, waste: Waste, foundations: Foundations, piles: Piles })
const isInitTable = allPass([
	propSatisfies( len( 24 ), 'stock' )
, propSatisfies( len( 0 ), 'waste' )
, propSatisfies( all( isEmpty ), 'foundations' )
, propSatisfies( all( propSatisfies( len( 1 ), 'upturned' )), 'piles' )
, propSatisfies( addIndex(all)(( val, i ) => propSatisfies( len( i ), 'downturned', val )), 'piles' )
])
const InitTable = $.NullaryType( 'InitTable', allPass([ test( Table ), isInitTable ]))


/*  Model  */
const Model = $.RecordType({
	draw3: $.Boolean
, table: Table
, initTable: Table
// , selectedCard: $.Nullable( Lens )
})


/*  VDOM  */
const NullableObj = Nullable( $.Object )
const SnabbData = Nullable( $.Object )
const VnodeArray = Nullable( $.NullaryType( 'VnodeArray', Ary( Vnode )))

const _Vnode = $.RecordType({ sel: $.String, data: SnabbData, children: Nullable($.Any), text: Nullable($.String), elm: $.Any, key: $.Any })
const Vnode = $.NullaryType( 'Vnode', test(_Vnode) )
// I will have to write a recursive validator. The libarary's not going to do it for me.

export { def, Deck, Model, Table, InitTable, Vnode }
