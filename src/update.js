import Type from 'union-type'
import { assoc, dissoc, isEmpty, compose, take, props, flatten } from 'ramda'

const Action = Type({
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

export default
( model, action ) => Action.case({
    Deal: () => newTable( model )
  , Reset: () => assoc( 'table', model.initTable, model )
  , Draw: () => {
      const hide = table => compose
      ( assoc( 'wasteVisible', [] )
      , assoc( 'wasteHidden', compose( flatten, props([ 'wasteVisible', 'wasteHidden' ]), table ))
      , table )

      isEmpty( model.table.stock ) && return compose( assoc( model.table.stock ))

      // hide visible. take from stock to waste
      // const model.table.wasteVisible
    }
  , PickCard: cardPath => assoc( 'selectedCard', cardPath, model )  // set selectedCard to a lens / path  --  make ValidPath :: Type
  , PutCard: cardPath => {}
    // Maybe move selectedCard on top of cardPath
    // Check out Elm-effects/Redux-effects for beep sound side-effect
    // See if lenses are a suitable abstraction for pick and put
  , DropCard: () => dissoc( 'cardPath', model )
  , Undo: () => {}
  , ShowSettings: () => {}
  , UpdateSettings: () => {}
  }, action )