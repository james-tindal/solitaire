
import Type from 'union-type'

const Result = Type({ Select: [], Deselect: [], Move: [], Continue: [] })
const { Select, Deselect, Move, Continue } = Result

const isTrue = x => typeof x == 'function' ? x() === true : x === true

Result.prototype.map = function( fn ) {
  return Result.case(
  { Select: () => Select()
  , Deselect: () => Deselect()
  , Move: () => Move()
  , Continue: () => Result.case(
    { Select: () => Select()
    , Deselect: () => Deselect()
    , Move: () => Move()
    , Continue: () => Continue()
    }, fn())
  }
  , this )
}

Result.prototype.select = function( x ) {
  return Result.case(
  { Select: () => Select()
  , Deselect: () => Deselect()
  , Move: () => Move()
  , Continue: () => isTrue(x) ? Select() : Continue()
  }, this )
}

Result.prototype.deselect = function( x ) {
  return Result.case(
  { Select: () => Select()
  , Deselect: () => Deselect()
  , Move: () => Move()
  , Continue: () => isTrue(x) ? Deselect() : Continue()
  }, this )
}

Result.prototype.move = function( x ) {
  return Result.case(
  { Select: () => Select()
  , Deselect: () => Deselect()
  , Move: () => Move()
  , Continue: () => isTrue(x) ? Move() : Continue()
  }, this )
}

export default Result