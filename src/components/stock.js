
import h from 'snabbdom/h'
import { isEmpty } from 'ramda'
import tcomb from 'tcomb'
import { Stock } from 'types'
import downturnedCard from './downturned-card'
import { Action } from 'actions'

export default
( action$, stock: Stock ) =>
	h( 'div.stock'
	,	{	on: { click: [ action$, Action.Draw() ]}}
  , [ isEmpty( stock ) ? h( 'div.empty' ) : downturnedCard() ]
	)
