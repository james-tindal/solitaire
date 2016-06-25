
import h from 'snabbdom/h'
import { concat, curry, lensProp as lp, lensIndex as li } from 'ramda'
import tcomb from 'tcomb'
import { Pile, Lenses } from 'types'
import card from './card'
import downturnedCard from './downturned-card'


export default
curry(( action$, pile: Pile, pileIdx ) =>
	h( 'div.pile', concat(
		pile.downturned.map( downturnedCard )
	, pile.upturned.map(( model, cardIdx ) => card( action$, model, [ lp('table'), lp('piles'), li(pileIdx), lp('upturned'), li(cardIdx) ]))
	))
)
