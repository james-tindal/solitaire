
import h from 'snabbdom/h'
import { curry } from 'ramda'
import t from 'tcomb'
import { Card, Lenses } from 'types'
import { Action } from 'actions'


export default
curry(( action$, card: Card, path  ) =>
	h( 'img.card'
	, { props: { src: `/cards/${card.join('_')}.svg` }
		, on: { click: [ action$, path && Action.Move( path, 'card' ) ]}
		}
	)
)

// If path is false, Move does nothing
