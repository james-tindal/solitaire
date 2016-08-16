import { assoc, construct, curry, identity, pipe, propOr, reduce, map, objOf } from 'ramda'

const Decision = name => {
  const c = new Function( `return function ${name}( source ){ return Object.assign( this, source ) }` )()
  c.of = construct( c )
  c.prototype = Object.create({}
  , { of: { value: c.of }
    , map: { value: function( fn ) { return c.of( fn( this )) }}
    , ap: { value: function( apply ) {
        return name == 'Unresolved'
        ? c.of( this( apply ))
        : this
      }}
    , chain: { value: function( fn ) {
        return name == 'Unresolved'
        ? fn( this )
        : this
      }}
    , cata: { value: function( mapObj ) { return propOr( identity, name, mapObj )( this ) }}
    })
  return c
}
// Find an abstraction for using top-level props as variables


module.exports = pipe
( reduce(( acc, name ) => assoc( name, Decision(name), acc ), {} )
, assoc( 'Decision', Decision( 'Unresolved' ) )
, assoc( 'cata', curry(( mapObj, m ) => m.cata( mapObj )))
)
