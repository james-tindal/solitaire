
import h from 'snabbdom/h'
import { curry } from 'ramda'
import tcomb from 'tcomb'
import { Card } from 'types'
import { Action } from 'actions'


export default
curry(( action$, card: Card, path ) =>
	h( 'img.card'
	, { props: { src: `/cards/${card.join('_')}.svg` }
		, on: { click: [ action$, Action.Move( path ) ]}
		}
	)
)

// If path is false, Move does nothing
