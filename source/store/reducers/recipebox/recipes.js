const assign = (a, b) => Object.assign({}, a, b)
const get = attr => object => object[attr]
const getId = get('id')

const newId = list =>
  Math.max.apply( null, list.map(getId) ) + 1

const actions =
{ ADD_RECIPE: ( xs, item ) =>
    xs.concat( assign( item, {id: newId(xs) } ) )
, EDIT_RECIPE: ( xs, item ) =>
    xs.map( x => x.id === item.id ? item : x )
, DELETE_RECIPE: ( xs, id ) =>
    xs.filter( x => !( x.id === id ) )
}

export default ( state, { type, recipe }) =>
  assign( state, { recipes: actions[type]( state.recipes, recipe ) } )
