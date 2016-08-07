
import h from 'snabbdom/h'
import { isEmpty, curry, last } from 'ramda'
import tcomb from 'tcomb'
import { Foundation } from 'types'
import card from './card'
import { Action } from 'actions'

export default
curry(( action$, foundation: Foundation, idx ) =>
	h( 'div.foundation'
  , [ isEmpty(foundation)
    ? h( 'div.empty', { on: { click: [ action$, Action.Move([ 'foundations', idx, 0 ], 'empty' ) ]}})
    : card( action$, last( foundation ), [ 'foundations', idx, foundation.length - 1 ])
    ])
)
