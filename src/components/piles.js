
import tcomb from 'tcomb'
import { Piles } from 'types'
import pile from './pile'
import yo from 'yo-yo'

export default
( action$, piles: Piles ) => yo`
  <div class="piles">
    ${ piles.map( pile( action$ ))}
  </div>
`
