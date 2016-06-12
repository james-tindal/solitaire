
import Type from 'union-type'
import { assoc, dissoc, isEmpty, compose, take, props, flatten, lensProp, takeLast, view, flip, over, map } from 'ramda'


// Lenses
const subLens = lens => str => compose( lens, lensProp(str) )
const table = lensProp( 'table' )
const [  wasteHidden,  wasteVisible,  stock  ] =  map( subLens( table )
    , [ 'wasteHidden','wasteVisible','stock' ])

//    transform :: Lens, Lens, ( Any -> Any ) -> Model
const transform =
([ src, dst, xform ]) => compose( over( dst ), xform, view( src ))( model )

//  -----------------------------------------------------------------  //


const Deal = model => () => newTable( model )
const Reset = model => () => assoc( 'table', model.initTable, model )

const Draw = model => () => {
  // If stock is empty, concat visible and hidden, set on stock, empty waste
  // Move all from wasteVisible to wasteHidden
  // Move 3 from stock to wasteVisible

  return view( 'stock' ) === []
  // set stock to result of concat visible and hidden
  ? ''
  : apply( pipe, map( transform, [
      [ aLens, bLens, flip( concat )]
    , [ cLens, aLens, pipe( takeLast(3), always )]
    , [ cLens, cLens, pipe( dropLast(3), always )]
    ]))( model )
}

const PickCard = model => cardPath => assoc( 'selectedCard', cardPath, model )  // set selectedCard to a lens / path  --  make ValidPath :: Type
const PutCard = model => cardPath => {}
    // Maybe move selectedCard on top of cardPath
    // Check out Elm-effects/Redux-effects for beep sound side-effect
    // See if lenses are a suitable abstraction for pick and put
const DropCard = model => () => dissoc( 'cardPath', model )
const Undo = model => () => {}
const ShowSettings = model => () => {}
const UpdateSettings = model => () => {}


//  ------------------------------------------  //

export const Action = Type({
  Deal: []
, Reset: []
, Draw: []
, PickCard: []
, PutCard: []
, DropCard: []
, Undo: []
, ShowSettings: []
, UpdateSettings: []
})

export const actions = {
	Deal
, Reset
, Draw
, PickCard
, PutCard
, DropCard
, Undo
, ShowSettings
, UpdateSettings
}
