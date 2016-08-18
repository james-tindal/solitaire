import { list } from 'tcomb'
import { Card } from 'types'
import { head as fst, last as snd, prop, flip, pipe, map, intersperse } from 'ramda'

const CardList = list( Card )

const suit = pipe( snd, flip(prop)(
{ hearts   : '♥'
, diamonds : '♦'
, spades   : '♠'
, clubs    : '♣'
}))
const rank = pipe( fst, flip(prop)(
{ 1  : 'A'
, 11 : 'J'
, 12 : 'Q'
, 13 : 'K'
}))
const cardString = card => ( rank(card) || fst(card) ) + suit(card)

const color = pipe( snd, flip(prop)(
{ hearts   : 'red'
, diamonds : 'red'
, spades   : 'black'
, clubs    : 'black'
}))

const formatCard = card => [ 'span', { style: 'color: ' + color(card) }, cardString(card) ]
const formatCards = pipe( map( formatCard ), intersperse(' '))

const formatCardList = 
{ header: obj => CardList.is(obj)
  ? [ 'div', {}, '[', ...formatCards( obj ), ']' ]
  : null
, hasBody: () => false
}

window.devtoolsFormatters = [ formatCardList ]
