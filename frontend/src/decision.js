import { assoc, construct, identity, invoker, pipe, propOr, reduce } from 'ramda'

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


module.exports = pipe
( reduce(( acc, name ) => assoc( name, Decision(name), acc ), {} )
, assoc( 'Decision', Decision( 'Unresolved' ) )
, assoc( 'cata', invoker( 1, 'cata' ))
)
