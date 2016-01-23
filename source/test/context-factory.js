import test from 'ava'
import React from 'react'
import context from '../context-factory'

test( 'Should attach contextTypes to passed object', assert => {
  const actual = context( {} )

  const expected = { contextTypes: { dispatch: React.PropTypes.func } }

  assert.same( actual, expected )
})
