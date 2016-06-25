
import h from 'snabbdom/h'
import tcomb from 'tcomb'
import { Piles } from 'types'
import pile from './pile'

export default
( action$, piles: Piles ) =>
	h( 'div.piles', piles.map( pile( action$ )))
