
import h from 'snabbdom/h'
import { isEmpty } from 'ramda'
import tcomb from 'tcomb'
import { VisibleWaste } from 'types'
import card from './card'

export default
( action$, wasteVisible: VisibleWaste ) =>
	h( 'div.waste'
  , wasteVisible.map(( model, i ) =>
    card( action$, model, i === wasteVisible.length-1 && [ 'wasteVisible', wasteVisible.length ])
    )
  )

