
import { curry } from 'ramda'
import h from 'snabbdom/h'

import { def, Model } from 'types'


// Initialise state
import shuffle from 'shuffle'
import deal from 'deal'
const newTable = model => {
  const table = deal(shuffle())
  return { ...model, table, initTable: table }
}

const init = () => newTable({ draw3: true })



// View
import stock from 'stock'
import foundations from 'foundations'

const view = curry(( action$, model ) =>
  h( 'div.table', [
    // console.log(stock( table.stock )),
    foundations( model )

    // pile(),
    // pile(),
    // pile(),
    // pile(),
    // pile(),
    // pile()
  ]))


export { init, view }