import test from 'ava'
import group from './testGroup'
import deal from '../dealer'
import shuffle from '../shuffler'

test( 'Should be a function', assert => {
  assert.is( deal.constructor, Function )
})

test( 'Should throw on not receiving an array', assert => {
  assert.throws( () => deal() )
  assert.throws( () => deal(1) )
  assert.throws( () => deal('a') )
  assert.throws( () => deal(false) )
  assert.throws( () => deal(Function) )
  assert.throws( () => deal({}) )
})

test( 'Should throw on array length not 52', assert => {
  assert.throws( () => deal( Array(51) ) )
  assert.throws( () => deal( Array(53) ) )

  assert.doesNotThrow( () => deal( Array(52) )
  , 'Should not throw on array length 52' )
})


group( 'With deck' )

test( 'Should return an object', assert => {
  const deck = shuffle()
  const table = deal( deck )

  assert.is( table.constructor, Object )
})

test( 'Table has stock: array, waste: array(0), foundations: array, piles: array', assert => {
  const deck = shuffle()
  const { stock, waste, foundations, piles } = deal( deck )

  assert.true( Array.isArray( stock )
  , 'Stock should be an array')

  assert.same( waste, []
  , 'Waste should be an empty array' )

  assert.true( Array.isArray( foundations )
  , 'Foundations should be an array')

  assert.true( Array.isArray( piles )
  , 'Piles should be an array' )

})

test( 'Table has four foundations: array(0)', assert => {
  const deck = shuffle()
  const { foundations } = deal( deck )

  assert.is( foundations.length, 4
  , 'Should have four foundations' )

  foundations.forEach(( f, i ) => 
    assert.true( Array.isArray( f )
    , `Foundations[${i}] is not an array` )
    &&
    assert.is( f.length, 0
    , `Foundations[${i}] is not empty` )
  )
})

test( 'Table has seven piles', assert => {
  const deck = shuffle()
  const { piles } = deal( deck )

  assert.is( piles.length, 7 )
})

test( 'Stock has 24 cards', assert => {
  const deck = shuffle()
  const { stock } = deal( deck )

  assert.is( stock.length, 24 )

})

test( 'Each pile has upturned: array', assert => {
  const deck = shuffle()
  const { piles } = deal( deck )

  piles.forEach(( pile, i ) =>
    assert.true( Array.isArray( pile.upturned )
    , `piles[${i}].upturned is not an array` )
  )
})

test( 'Each pile has one upturned card', assert => {
  const deck = shuffle()
  const { piles } = deal( deck )

  piles.forEach(( pile, i ) =>
    assert.is( pile.upturned.length, 1
    , `piles[${i}].upnturned.length is not 1` )
  )
})

test( 'Each pile has downturned: array', assert => {
  const deck = shuffle()
  const { piles } = deal( deck )

  piles.forEach(( pile, i ) =>
    assert.true( Array.isArray( pile.downturned )
    , `piles[${i}].downturned is not an array` )
  )
})

test( 'Each pile has downturned cards equal to index', assert => {
  const deck = shuffle()
  const { piles } = deal( deck )

  piles.forEach(( pile, i ) =>
    assert.is( pile.downturned.length, i
    , `piles[${i}].downturned.length is not ${i}` )
  )
})

// test( 'Each card input is represented in the output', assert => {
//   const deck = shuffle()
//   const { stock, piles } = deal( deck )

//   const flatTable = [].concat( stock, piles.unpturned, piles.downturned )

//   deck.forEach(( a, i ) => {
//     const cardFound = flatTable.some( b => a == b )
//     assert.true( cardFound
//     , `deck[${i}] not found on table` )
//   })
// })


/*
For each card in the deck.
Compare to every other card
Throw if none are the same
Concatall first
*/