import { Button, ButtonToolbar } from 'react-bootstrap'
import context from 'context-factory'

export default React => context( ({ id }, { dispatch }) =>
    <ButtonToolbar>
      <Button onClick={ () => dispatch({ type: 'DELETE_RECIPE', recipe: id }) } bsStyle="danger">Delete</Button>
      <Button onClick={ () => dispatch({ type: 'SHOW_RECIPE_DIALOG', action: 'edit', id }) }>Edit</Button>
    </ButtonToolbar>
)
