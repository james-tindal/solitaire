
import { curry } from 'ramda'
import h from 'snabbdom/h'
import tcomb from 'tcomb'
import { Model } from 'types'


// Initialise state
import shuffle from 'shuffle'
import deal from 'deal'
const newTable = settings => {
  const table = deal(shuffle())
  return { ...settings, table, initTable: table }
}

const init = (): Model => newTable({ draw3: true })



// View
import stock from 'components/stock'
import foundations from 'components/foundations'
import piles from 'components/piles'
import waste from 'components/waste'

import { Action } from 'actions'
const view = curry(( action$, model ) =>
  h( 'div.table', [
    stock( action$, model.table.stock ),
    waste( action$, model.table.wasteVisible ),
    foundations( action$, model.table.foundations ),
    piles( action$, model.table.piles ),
    
  ]))


export { init, view }