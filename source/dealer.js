
export default deck => {
  confirmArg( deck )

  const stock = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  const waste = []
  const foundations = [ [], [], [], [] ]
  const piles =
  [ { upturned: [ 0 ], downturned: [] }
  , { upturned: [ 0 ], downturned: [0] }
  , { upturned: [ 0 ], downturned: [0, 0] }
  , { upturned: [ 0 ], downturned: [0, 0, 0] }
  , { upturned: [ 0 ], downturned: [0, 0, 0, 0] }
  , { upturned: [ 0 ], downturned: [0, 0, 0, 0, 0] }
  , { upturned: [ 0 ], downturned: [0, 0, 0, 0, 0, 0] }
  ]

  // replace every zero with a card? how do I write a spec? Take it slow and write your plan

  return { stock, waste, foundations, piles }
}


const confirmArg = arg => 
  ( Array.isArray( arg ) || typeError() ) &&
  ( arg.length === 52    || rangeError() )

const typeError = () => { throw new TypeError( 'Argument should be an array' ) }
const rangeError = () => { throw new RangeError( 'Deck should have 52 cards' ) }

// const Dealer = deck => 

// // Dealer is a function that takes deck and returns a function that pops cards off the deck and returns them each time it's called