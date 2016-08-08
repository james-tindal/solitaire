
import { isEmpty } from 'ramda'
import tcomb from 'tcomb'
import { VisibleWaste } from 'types'
import card from './card'
import Action from 'actions'
import yo from 'yo-yo'

export default
( action$, wasteVisible: VisibleWaste ) => yo`
  <div class="waste">
    ${ wasteVisible.map(( model, idx ) =>
      card( action$, model
      , idx === wasteVisible.length-1 && Action.Move({ path: [ 'wasteVisible', idx ]})
      )
    )}
  </div>
`
