import { either, map, when, head } from 'ramda'
import Action from 'actions'
import keyboard from 'keyboardjs'


const isDeal = action => action.value === Action.Deal().value
const isReset = action => action.value === Action.Reset().value

let tableHistory = []
let push = true

export default
( action$, model$ ) => {
  map( when( either( isDeal, isReset ), _ => tableHistory = [] ), action$ )
  map( m => push ? tableHistory.push(m.table) : push = true, model$ )
  map( _ => console.log(tableHistory.length), model$ )
  keyboard.bind( 'command + z', _ =>
    action$( Action.Undo({ table: ( push = false, tableHistory.pop(), head(tableHistory) ) })))
}
