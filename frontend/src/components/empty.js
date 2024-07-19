
import yo from 'yo-yo'
import { curry } from 'ramda'
import t from 'tcomb'
import { Card, Lenses } from 'types'
import Action from 'actions'

export default
path => yo`<div class="empty" x-path=${ JSON.stringify(path) }></div>`
