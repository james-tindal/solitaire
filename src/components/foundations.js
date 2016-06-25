
import h from 'snabbdom/h'
import { isEmpty } from 'ramda'
import tcomb from 'tcomb'
import { Foundations } from 'types'
import foundation from './foundation'

export default
( action$, foundations: Foundations ) =>
	h( 'div.foundations', foundations.map( foundation( action$ )))
