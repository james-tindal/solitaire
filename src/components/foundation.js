
import { isEmpty, curry, last } from 'ramda'
import tcomb from 'tcomb'
import { Foundation } from 'types'
import card from './card'
import Action from 'actions'
import yo from 'yo-yo'

export default
curry(( action$, foundation: Foundation, idx ) => yo`
  <div class="foundation">${
    isEmpty( foundation )
    ? yo`<div class="empty" onclick=${ e => action$( Action.Move({ path: [ 'foundations', idx, 0 ], empty: true }) )}></div>`
    : card( action$, last( foundation ), [ 'foundations', idx, foundation.length - 1 ])
  }</div>
`)
