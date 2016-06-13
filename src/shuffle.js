import { range } from 'ramda'
import t from 'tcomb'
import { Deck } from 'types'

Array.prototype.concatAll = function () {
  const output = []
  this.forEach( ary =>
    ary.forEach( el => output.push( el ) ))
  return output
}

Array.prototype.shuffle = function () {
  let array = this
  let m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

// shuffle :: () -> Deck
export default (): Deck =>
  range( 1, 14 ).map( rank =>
    [ [ rank, 'hearts' ]
    , [ rank, 'clubs' ]
    , [ rank, 'spades' ]
    , [ rank, 'diamonds' ]]
  ).concatAll().shuffle()
