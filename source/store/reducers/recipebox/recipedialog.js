const assign = Object.assign;
const get = attr => object => object[attr]
const getId = get('id')

export default ( state, { action, id }) => {
  switch ( action ) {
    case 'add' :
      return assign({}, state,
        { dialog: { show: true, action }} )

    case 'edit' :
      const recipe = state.recipes.filter(el => getId(el) === id)[0]
      return assign({}, state,
        { dialog: { show: true, action, recipe }} )

    default :
      return state
  }
}


