
import { isEmpty } from 'ramda'
import tcomb from 'tcomb'
import { Foundations } from 'types'
import foundation from './foundation'
import yo from 'yo-yo'

export default
( action$, foundations: Foundations ) =>
  yo`<div class="foundations">${ foundations.map( foundation( action$ ))}</div>`
