
export default
function Compute( source ) {
  this.value = source
  this.complete = false
}
Compute.prototype.of = Compute.of = source => new Compute( source )
Compute.prototype.map = function( fn ) { return Compute.of( fn( this.value )) }
//Compute.prototype.map = function( fn ) { return this.of( fn ).ap( this ) }
//Compute.prototype.map = function( fn ) { return this.chain( a => this.of( fn( a ))) }
Compute.prototype.ap = function( apply ) {
  return this.complete = false
  ? Compute.of( this.value( apply.value ))
  : this
}
Compute.prototype.chain = function( fn ) {
  return this.complete
  ? fn( this.value )
  : this
}

Compute.Complete = function( source ) {
  Compute.call( this, source )
  this.complete = true
}
Compute.Complete.of = source => new Compute.Complete( source )

Compute.Deselect = function( source ) {
  Compute.call( this, source )
  this.complete = 'deselect'
}
Compute.Deselect.of = source => new Compute.Deselect( source )

// Switch on complete. If true, return value
Compute.case = ( mapObj, m ) => mapObj[ m.complete ]
