
import yo from 'yo-yo'
import { curry } from 'ramda'
import t from 'tcomb'
import { Card, Lenses } from 'types'
import Action from 'actions'

export default
curry(( path ) => {
  const elem = yo`<div class="empty"></div>`
  elem.path = path
  return elem
})
