/* global React */ // change to turn off react rule
import { Button, Input, Modal } from 'react-bootstrap'
import context from 'context-factory'
const assign = (a, b) => Object.assign({}, a, b)

const RecipeDialog = ({ show, action, recipe = {} }, { dispatch }) => {
  const close = () => dispatch({ type: 'HIDE_RECIPE_DIALOG' })
  const post = () => {
    const recipeN = assign(recipe,
    { name: RecipeDialog.recipe.getValue()
    , ingredients: RecipeDialog.ingredients.getValue().split(',')
    })
    dispatch(
    { type: action === 'edit' ? 'EDIT_RECIPE' : 'ADD_RECIPE'
    , recipe: recipeN } )
    close()
  }

  return (
    <Modal show={show} onHide={ close }>
      <Modal.Header closeButton>
        <Modal.Title>{ action === 'add' ? 'Add a' : 'Edit' } Recipe</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
          <Input
            type="text"
            label="Recipe"
            placeholder="Recipe name"
            defaultValue={ recipe.name } autoFocus
            ref={ref => RecipeDialog.recipe = ref } />
          <Input
            type="text"
            label="Ingredients"
            placeholder="Enter ingredients, separated by commas"
            defaultValue={ recipe.ingredients }
            ref={ref => RecipeDialog.ingredients = ref} />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={ post }
          bsStyle="primary">{action === 'add' ? 'Add' : 'Edit'} Recipe</Button>
        <Button
          onClick={ close }
        >Close</Button>
      </Modal.Footer>
    </Modal> )
}

export default React => context( RecipeDialog )
