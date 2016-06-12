
import h from 'snabbdom/h'
import { forEach } from 'ramda'
import { def, Model, Vnode } from 'types'

export default
def( 'foundations', {}, [ Model, Vnode ],
model => h('a', [ h('b') ])
)