
import flyd, { combine } from 'flyd'
import flatMap from 'flyd/module/flatmap'
import takeUntil from 'flyd/module/takeuntil'
import { map, isNil } from 'ramda'
import Action from 'actions'


const mousemove = flyd.stream()
const mouseup   = flyd.stream()
const mousedown = flyd.stream()
export default obj => obj.md.button === 0 && mousedown( obj )

document.addEventListener( 'mousemove', mousemove )
document.addEventListener( 'mouseup', mouseup )


const mousedrag = flatMap( obj => {
  const { action$, md } = obj
  const startX = md.clientX, startY = md.clientY

  return takeUntil( map( mm => {
    mm.preventDefault()
    return {
      left: mm.clientX - startX
    , top: mm.clientY - startY
    , migrant: md.target
    , action$
    }
  }, mousemove ), mouseup )
}, mousedown )

const dragEnd = flatMap( _ => takeUntil( mouseup, dragEnd ), mousedown )

flyd.on( obj => {
  if( obj === null ) return
  const { left, top, migrant } = obj
  migrant.style.zIndex = '1000'
  migrant.style.transform = `translate(${left}px,${top}px)`
}, mousedrag )

flyd.on( mu => {
  if( isNil( mousedrag())) return
  const { migrant, action$ } = mousedrag()
  mousedrag(null)
  migrant.style.zIndex = null
  migrant.style.transform = null
  const occupant = document.elementFromPoint( mu.clientX, mu.clientY )
  const occupantP = JSON.parse( occupant.getAttribute( 'x-path' ))
  const migrantP = JSON.parse( migrant.getAttribute( 'x-path' ))
  occupantP && action$( Action.Move({ migrantP, occupantP }))
}, dragEnd )
