import test from 'ava'
import shuffle from '../shuffler.js'


test( 'Should be a function', assert => {
  const actual = shuffle.constructor
  const expected = Function
  assert.same( actual, expected )
})


test( 'Should return an array', assert => {
  const deck = shuffle()

  assert.true( Array.isArray( deck ) )
})

test( 'Should return an array of 52 objects', assert => {
  const deck = shuffle()

  const actual =
    deck.reduce(( acc, obj ) =>
      obj.constructor !== Object
      ? assert.fail( 'Array item should be an Object' )
      : acc + 1
    , 0 )

  const expected = 52

  assert.is( actual, expected
  , 'Array should contain 52 items' )
})

test( 'Each card should have suit: string, rank: number', assert => {
  const deck = shuffle()

  deck.forEach( card => {
    assert.ok( card.suit && card.rank
    , 'Should have suit and rank' )
    assert.is( card.suit.constructor, String
    , 'Suit should be a string' )
    assert.is( card.rank.constructor, Number
    , 'Rank should be a number' )
  })
})

test( 'Deck should have four of each rank and 13 of each suit', assert => {
  const deck = shuffle()
  const count =
  { rank: [ undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  , suit: { hearts: 0, spades: 0, clubs: 0, diamonds: 0 }
  }

  const actual =
    deck.reduce(( acc, card ) => {
      acc.rank[ card.rank ] ++
      acc.suit[ card.suit ] ++
      return acc
    }, count )

  const expected =
  { rank: [ undefined, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4 ]
  , suit: { hearts: 13, spades: 13, clubs: 13, diamonds: 13 }
  }

  assert.same( actual, expected )
})

test( 'Every card should be unique', assert => {
  const deck = shuffle()

  deck.forEach(( a, ia ) =>
    deck.forEach(( b, ib ) =>
      ia !== ib &&
      assert.notSame( a, b )
    )
  )
})

test( 'Deck should be shuffled', assert => {
  let counter = 0
  const firstCards = []
  while( counter < 100 ) {
    firstCards.push( shuffle()[0] )
    counter++
  }
  // reduce. if every card is the same as the last, fail
  firstCards.reduce(( prev, cur ) =>
    assert.notSame( prev, cur )
  )

  const usesFisherYatesShuffle = true
  assert.true( usesFisherYatesShuffle
  , 'Only Fisher-Yates shuffle is unbiased' )

})

