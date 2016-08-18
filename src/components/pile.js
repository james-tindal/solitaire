
import { addIndex, compose, concat, curry, isEmpty, map as m, reverse } from 'ramda'
const map = addIndex(m)
import tcomb from 'tcomb'
import { Pile, Lenses } from 'types'
import card from './card'
import empty from './empty'
import downturnedCard from './downturned-card'
import Action from 'actions'
import yo from 'yo-yo'

export default
curry(( action$, pile: Pile, pileIdx ) => {
  const createPile = map(( model, cardIdx ) => card( action$, model, [ 'piles', pileIdx, 'upturned', cardIdx ]))

  if( isEmpty( pile.upturned ) && !isEmpty( pile.downturned ))
    action$( Action.ShowHiddenPile({ pileIdx }))

  const emptyPile
  =  isEmpty( concat( pile.upturned, pile.downturned ))
  && empty([ 'piles', pileIdx, 'upturned', 0 ])

  return yo`
    <div class="pile">
      ${ emptyPile ||
      [ ...pile.downturned.map( downturnedCard )
      , ...createPile( reverse( pile.upturned ))
      ]}
    </div>
  `
})