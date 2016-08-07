
import h from 'snabbdom/h'
import { addIndex, compose, concat, curry, isEmpty, map as m, reverse } from 'ramda'
const map = addIndex(m)
import tcomb from 'tcomb'
import { Pile, Lenses } from 'types'
import card from './card'
import downturnedCard from './downturned-card'
import { Action } from 'actions'



export default
curry(( action$, pile: Pile, pileIdx ) => {
  const createPile = map(( model, cardIdx ) => card( action$, model, [ 'table', 'piles', pileIdx, 'upturned', cardIdx ]))

  if( isEmpty( pile.upturned ) && !isEmpty( pile.downturned ))
    action$( Action.ShowHiddenPile( pileIdx ))

  const empty = isEmpty( concat( pile.upturned, pile.downturned ))
  ? [ h( 'div.empty', { on: { click: [ action$, Action.Move([ 'piles', pileIdx, 'upturned', 0 ], 'empty' ) ]}}) ]
  : null

  return h( 'div.pile', empty || [
    ...pile.downturned.map( downturnedCard )
  , ...createPile( pile.upturned )
  ])
})
