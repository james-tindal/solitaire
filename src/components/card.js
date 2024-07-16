
import yo from 'yo-yo'
import { curry } from 'ramda'
import t from 'tcomb'
import { Card } from 'types'
import Action from 'actions'
import drag from '../drag'

export default
curry(( action$, card: Card, path ) => yo`
  <div class="card card-${card[1]}-${card[0]}"
    onmousedown=${ path && (md => drag({ md, action$ }))}
    x-path=${ JSON.stringify(path) }
  ></div>
`)
