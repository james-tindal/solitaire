
import { isEmpty } from 'ramda'
import tcomb from 'tcomb'
import { Stock } from 'types'
import downturnedCard from './downturned-card'
import Action from 'actions'
import yo from 'yo-yo'

export default
( action$, stock: Stock ) => yo`
  <div class="stock" onclick=${ e => action$( Action.Draw() )}>
    ${ isEmpty( stock ) ? yo`<div class="empty"></div>` : downturnedCard() }
  </div>
`
