
import h from 'snabbdom/h'
import { isEmpty, lensProp as lp, lensIndex as li } from 'ramda'
import tcomb from 'tcomb'
import { VisibleWaste } from 'types'
import card from './card'

export default
( action$, wasteVisible: VisibleWaste ) =>
	h( 'div.waste'
  , wasteVisible.map(( model, i ) =>
      card( action$, model
      , i === wasteVisible.length-1 && [ lp('table'), lp( 'wasteVisible' ), li( wasteVisible.length-1 )]
      )
    )
  )

