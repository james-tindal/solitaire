
import { isEmpty, curry, head } from 'ramda'
import tcomb from 'tcomb'
import { Foundation } from 'types'
import card from './card'
import empty from './empty'
import Action from 'actions'
import yo from 'yo-yo'

export default
curry(( action$, foundation: Foundation, idx ) => {
  let topCard
  if( isEmpty( foundation )) {
    topCard = empty([ 'foundations', idx, 0 ])
  } else {
    topCard = card( action$, head( foundation ), [ 'foundations', idx, foundation.length - 1 ])
  }

  return yo`<div class="foundation">${ topCard }</div>`
})
