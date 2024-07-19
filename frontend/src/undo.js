import { compose, either, map, when, last, prop } from 'ramda'
import filter from 'flyd/module/filter'
import sampleOn from 'flyd/module/sampleon'
import Action from 'actions'
import keyboard from 'keyboardjs'


const is = type => action => action.value === Action[type]().value
const dealOrReset = either( is('Deal'), is('Reset') )
const drawOrMove = either( is('Draw'), is('Move') )

let tableHistory = []

export default
( action$, model$ ) => {
  const shouldSample$ = filter( either( dealOrReset, drawOrMove ))( action$ )
  const table$ = compose( map( prop( 'table' )), sampleOn( shouldSample$ ))( model$ )
  action$.map( when( dealOrReset, _ => tableHistory = [] ))
  table$.map( [].push.bind( tableHistory ))
  keyboard.bind( 'command + z', _ =>
    tableHistory.length > 1 && action$( Action.Undo({ table: tableHistory.pop() })))
}
