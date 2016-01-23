import dialog from 'store/reducers/recipebox/recipedialog'
import recipes from 'store/reducers/recipebox/recipes'

const assign = (a, b) => Object.assign({}, a, b)

export default (
    state = {}, action = {}
  ) => {

  switch (action.type) {
    case 'SHOW_RECIPE_DIALOG':
      return dialog( state, action )
    case 'HIDE_RECIPE_DIALOG':
      return assign( state,
        { dialog: { show: false }} )

    case 'ADD_RECIPE':
      return recipes( state, action )
    case 'EDIT_RECIPE' :
      return recipes( state, action )
    case 'DELETE_RECIPE' :
      return recipes( state, action )

    default:
      return state
  }

};
