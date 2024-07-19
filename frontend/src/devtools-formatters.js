import t, { list } from 'tcomb'
import { Card, Path, Foundations } from 'types'
import R, { always, chain, compose, cond, curry, defaultTo, flip, isArrayLike, head, head as fst, intersperse, last as snd, prop, pipe, map, unnest, when } from 'ramda'

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
const cardFormatter = 
{ header: obj => CardList.is(obj)
  ? [ 'div', {}, '[', ...formatCards( obj ), ']' ]
  : null
, hasBody: () => false
}

// ----------------- //

const colorPath = curry(( color, path ) => [ 'span', { style: 'color:#' + color }, path ])

const formatPath = cond(
[ [ t.Number.is, colorPath( '007acc' ) ]
, [ t.String.is, colorPath( 'ff0066' ) ]
, [ t.Boolean.is, colorPath( '00cc00' ) ]
])
const formatPaths = pipe( map( formatPath ), intersperse(', '))
const pathFormatter =
{ header: obj => Path.is(obj)
  ? [ 'div', {}, '[', ...formatPaths( obj ), ']' ]
  : null
, hasBody: () => false
}

// ----------------- //
const log = ( a, b ) => { console.log(a,b);return a}

// const formatFnd = x => formatCard(head(x)) || 'e'
// const formatFnds = compose( chain(formatCard), chain(head))
const formatFnds = compose( intersperse(' '), map(compose( defaultTo('e'), when( isArrayLike, formatCard), head )))
const foundationFormatter =
{ header: obj => Foundations.is(obj)
  ? [ 'div', {}, ...formatFnds( obj ) ]
  : null
, hasBody: () => false
}

window.devtoolsFormatters = [ cardFormatter, pathFormatter, foundationFormatter ]
