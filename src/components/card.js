
import yo from 'yo-yo'
import { curry } from 'ramda'
import t from 'tcomb'
import { Card, Lenses } from 'types'
import Action from 'actions'


export default
curry(( action$, card: Card, action  ) => yo`
  <img class="card"
    src="/cards/${card.join('_')}.svg"
    onclick=${ e => action$( action )}
  >
`)
