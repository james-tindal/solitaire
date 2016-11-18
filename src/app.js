
import yo from 'yo-yo'
import tcomb from 'tcomb'
import { Model } from 'types'
const log = x => console.log(x) || x

const init = () => ({ draw3: true })

// View
import stock from 'components/stock'
import foundations from 'components/foundations'
import piles from 'components/piles'
import waste from 'components/waste'

const view = action$ => model =>
model.table ? yo`
  <div class="table">
    ${ stock( action$, model.table.stock )}
    ${ waste( action$, model.table.wasteVisible )}
    ${ foundations( action$, model.table.foundations )}
    ${ piles( action$, model.table.piles )}
  </div>`
: yo`<div></div>`

export { init, view }