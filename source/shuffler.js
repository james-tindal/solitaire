import { range } from 'ramda'

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

export default () =>
  range( 1, 14 ).map( rank =>
    [ { rank, suit: 'hearts' }
    , { rank, suit: 'clubs' }
    , { rank, suit: 'spades' }
    , { rank, suit: 'diamonds' } ]
  ).concatAll().shuffle()
