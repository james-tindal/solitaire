import React from 'react'
import { render } from 'react-dom'
import createApp from './App'

import createProvider from 'provider'
import { createStore } from 'redux'
import recipeBox from 'store/reducers/recipebox'

const initialState =
{ dialog:
  { show: false }
, recipes:
  [ { id: 0
    , name: 'Cake'
    , ingredients: [ 'Butter', 'Sugar', 'Eggs', 'Flour' ]
    }
  , { id: 1
    , name: 'Salad'
    , ingredients: [ 'Kale', 'Quinoa', 'Aubergine' ]
    }
  , { id: 3
    , name: 'Pizza'
    , ingredients: [ 'Flour', 'Water', 'Yeast', 'Passata', 'Cheese']
    }
  ]
}

const store = createStore(recipeBox, initialState)
const App = createApp(React)
const Provider = createProvider(React)

const renderApp = () => {
  const props =
  { store
  , title: 'Solitaire'
  }
  render(
    <Provider dispatch={ store.dispatch }>
      <App { ...props }></App>
    </Provider>
    , document.getElementById('root')
  )
}

store.subscribe(() => {
  renderApp()
})

renderApp()
