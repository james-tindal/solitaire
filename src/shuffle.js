import { range, compose, chain } from 'ramda'
import t from 'tcomb'
import { Deck } from 'types'

function shuffle( array ) {
  let m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array
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
