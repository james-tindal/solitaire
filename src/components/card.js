
import yo from 'yo-yo'
import { curry } from 'ramda'
import t from 'tcomb'
import { Card, Lenses } from 'types'
import Action from 'actions'
import drag from '../drag'

export default
curry(( action$, card: Card, action  ) => {
  const elem = yo`
  <img class="card"
    src="/cards/${card.join('_')}.svg"
    onmousedown=${ md => drag({ action$, action, md })}
  > `
  elem.dispatch = () => action$( action )
  return elem
})
