import t from 'tcomb'

import { Deck, InitTable } from 'types'
import { range, map } from  'ramda'


export default
// Deal :: Deck -> InitTable
( deck: Deck ): InitTable => {
  const iter = deck[ Symbol.iterator ]()
  const card = () => iter.next().value

  const stock = map( card, range( 0, 24 ))
  const wasteHidden = []
  const wasteVisible = []
  const foundations = [ [], [], [], [] ]
  const piles =
  [ { upturned: [ card() ], downturned: [] }
  , { upturned: [ card() ], downturned: [card()] }
  , { upturned: [ card() ], downturned: [card(), card()] }
  , { upturned: [ card() ], downturned: [card(), card(), card()] }
  , { upturned: [ card() ], downturned: [card(), card(), card(), card()] }
  , { upturned: [ card() ], downturned: [card(), card(), card(), card(), card()] }
  , { upturned: [ card() ], downturned: [card(), card(), card(), card(), card(), card()] }
  ]

  return { stock, wasteHidden, wasteVisible, foundations, piles }
}
