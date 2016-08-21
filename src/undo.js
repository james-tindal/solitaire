import { compose, either, map, when, head, prop } from 'ramda'
import filter from 'flyd/module/filter'
import sampleOn from 'flyd/module/sampleon'
import Action from 'actions'
import keyboard from 'keyboardjs'


const is = type => action => action.value === Action[type]().value


let tableHistory = []
let push = true

export default
( action$, model$ ) => {
  const drawMove$ = filter( either( is('Draw'), is('Move') ))( action$ )
  const table$ = compose( map( prop( 'table' )), sampleOn( drawMove$ ))( model$ )
  action$.map( when( either( is('Deal'), is('Reset') ), _ => tableHistory = [] ))
  table$.map( table => push ? tableHistory.push(table) : push = true )
  keyboard.bind( 'command + z', _ =>
    action$( Action.Undo({ table: ( push = false, tableHistory.pop(), tableHistory.pop() ) })))
}
