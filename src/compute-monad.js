import { assoc, construct, curry, identity, pipe, propOr, reduce, map, objOf } from 'ramda'

const Compute = name => {
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


module.exports = pipe
( reduce(( acc, name ) => assoc( name, Compute(name), acc ), {} )
, assoc( 'Compute', Compute( 'Unresolved' ) )
, assoc( 'cata', curry(( mapObj, m ) => m.cata( mapObj )))
)
