
import { addIndex, compose, concat, curry, isEmpty, map as m, reverse } from 'ramda'
const map = addIndex(m)
import tcomb from 'tcomb'
import { Pile, Lenses } from 'types'
import card from './card'
import downturnedCard from './downturned-card'
import Action from 'actions'
import yo from 'yo-yo'

export default
curry(( action$, pile: Pile, pileIdx ) => {
  const createPile = map(( model, cardIdx ) => card( action$, model, Action.Move({ path: [ 'piles', pileIdx, 'upturned', cardIdx ]})))

  if( isEmpty( pile.upturned ) && !isEmpty( pile.downturned ))
    action$( Action.ShowHiddenPile({ pileIdx }))

  const empty = isEmpty( concat( pile.upturned, pile.downturned ))
  ? yo`<div class="empty" onclick=${ e => action$( Action.Move({ path: [ 'piles', pileIdx, 'upturned', 0 ], empty: true }))}></div>`
  : null

  return yo`
    <div class="pile">
      ${ empty ||
      [ ...pile.downturned.map( downturnedCard )
      , ...createPile( reverse( pile.upturned ))
      ]}
    </div>
  `
})