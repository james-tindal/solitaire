import { __, all, compose, head, identity as I, isEmpty, pipe, prop, reduce, tail, where } from 'ramda'
import is from 'is_js'
const log = ( a, b ) => { console.log(a,b);return a}

// const diverge = ( getter, setter ) =>
//   over( lens( getter, setter ), identity )

const rank = prop(0)
const noAccReduce = fn => arr => reduce( fn, head(arr), tail(arr) )
const rankIncrements = noAccReduce((a,b) => rank(b) == rank(a) +1 ? b : false )
// const rankDecrements = noAccReduce((a,b) => rank(b) == rank(a) -1 ? b : false )


// const detectWillWin = 

export default
action$ =>
pipe
( prop( 'table' )
, where(
  { stock: isEmpty
  , wasteHidden: isEmpty
  , wasteVisible: isEmpty
  , piles: all( where(
    { downturned: isEmpty
    , upturned: rankIncrements
    }))
  })
)
// diverge( detectWillWin, (a,model) => a &&  )


// Actual win state
// , propSatisfies( all(both( propEq( 'length', 13 ), rankDecrements )), 'foundations' )