
import flyd from 'flyd'
import flatMap from 'flyd/module/flatmap'
import takeUntil from 'flyd/module/takeuntil'
import { curry } from 'ramda'


const mousemove = flyd.stream()
const mouseup   = flyd.stream()
const mousedown = flyd.stream()
export default obj => obj.md.button === 0 && mousedown( obj )

document.addEventListener( 'mousemove', mousemove )
document.addEventListener( 'mouseup', mouseup )

flyd.on(({ md }) => md.target.classList.add( 'dragging' )
, mousedown)

const mousedrag = flatMap( obj => {
  const { action$, action, md } = obj
  const startX = md.clientX, startY = md.clientY
  action$( action )
  console.log(md.target, md.target.style)

  return takeUntil( flyd.map( mm => {
    mm.preventDefault()

    return {
      left: mm.clientX - startX
    , top: mm.clientY - startY
    , elem: md.target
    }
  }, mousemove ), mouseup )
}, mousedown )


flyd.on(({ left, top, elem }) =>
  elem.style.transform = `translate(${left}px,${top}px)`
, mousedrag )

flyd.on( ev => {
  ev.target.style.transform = null
  const { dispatch } = document.elementFromPoint( ev.clientX, ev.clientY )
  dispatch && dispatch()
}, mouseup )
