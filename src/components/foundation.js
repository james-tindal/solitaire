
import h from 'snabbdom/h'
import { isEmpty, curry } from 'ramda'
import tcomb from 'tcomb'
import { Foundation } from 'types'
import card from './card'

export default
curry(( action$, foundation: Foundation ) =>
	h( 'div.foundation'
	 , { on: { click: [  ]}}
	 , [ isEmpty(foundation) ? h( 'div.empty' ) : card( head( foundation ))]
	 )
)
