
import h from 'snabbdom/h'
import { concat, curry } from 'ramda'
import tcomb from 'tcomb'
import { Pile } from 'types'
import card from './card'
import downturnedCard from './downturned-card'


export default
curry(( action$, pile: Pile, pileIdx ) =>
	h( 'div.pile', concat(
		pile.downturned.map( downturnedCard )
	, pile.upturned.map(( model, cardIdx ) => card( action$, model, [ 'piles', pileIdx, cardIdx ]))
	))
)
