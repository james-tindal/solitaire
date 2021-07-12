import { range, compose, chain } from 'ramda'
import t from 'tcomb'
import { Deck } from 'types'

function shuffle( array ) {
  let i = array.length, ret = array.slice(), t, rn

  while (i) {
    rn = Math.floor( Math.random() * i-- )

    t = ret[i]
    ret[i] = ret[rn]
    ret[rn] = t
  }

  return ret
}

// shuffle :: () -> Deck
export default () => compose
( shuffle
, chain( rank => (
  [ [ rank, 'hearts' ]
  , [ rank, 'clubs' ]
  , [ rank, 'spades' ]
  , [ rank, 'diamonds' ]]
  ))
)( range( 1, 14 ))
