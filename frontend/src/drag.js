
import flyd, { combine } from 'flyd'
import flatMap from 'flyd/module/flatmap'
import takeUntil from 'flyd/module/takeuntil'
import { compose, head, isNil, last, map, prop } from 'ramda'
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

  let ns; const nextSibling = compose( prop( 'nextElementSibling' ), head )
  const migrant = arr => ( ns = nextSibling(arr), ns ? migrant([ ns, ...arr ]) : arr )

  return takeUntil( map( mm => {
    mm.preventDefault()
    return {
      left: mm.clientX - startX
    , top: mm.clientY - startY
    , migrant: migrant([ md.target ])
    , action$
    }
  }, mousemove ), mouseup )
}, mousedown )

// const dragEnd = flatMap( _ => takeUntil( mouseup, dragEnd ), mousedown )

flyd.on( obj => {
  if( obj === null ) return
  const { left, top, migrant } = obj
  migrant.forEach( m => m.style.cssText = `z-index: 1000; transform: translate(${left}px,${top}px)`)
}, mousedrag )

flyd.on( mu => {
  if( isNil( mousedrag())) return
  const { migrant, action$ } = mousedrag()
  mousedrag(null)
  migrant.forEach( m => m.style.cssText = null )
  const occupant = document.elementFromPoint( mu.clientX, mu.clientY )
  const occupantP = JSON.parse( occupant.getAttribute( 'x-path' ))
  const migrantP = JSON.parse( last(migrant).getAttribute( 'x-path' ))
  occupantP && action$( Action.Move({ migrantP, occupantP }))
}, mouseup )
