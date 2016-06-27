
import h from 'snabbdom/h'
import { isEmpty } from 'ramda'
import tcomb from 'tcomb'
import { VisibleWaste } from 'types'
import card from './card'
import { Action } from 'actions'
const log = a => { console.log(a); return a }

export default
( action$, wasteVisible: VisibleWaste ) => {
	return h( 'div.waste'
  , wasteVisible.map(( model, idx ) =>
      card( action$, model
      , idx === wasteVisible.length-1 && [ 'table', 'wasteVisible', idx ]
      )
    )
  )
}
