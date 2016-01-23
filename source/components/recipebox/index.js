import { Button } from 'react-bootstrap'
import context from 'context-factory'
import createRecipeTable from 'components/recipebox/recipetable'
import createRecipeDialog from 'components/recipebox/recipedialog'

export default React => context( ({ recipes, dialog }, { dispatch }) => {
  const RecipeTable = createRecipeTable(React)
  const RecipeDialog = createRecipeDialog(React)

  return (
    <div>
      <RecipeTable recipes={recipes} />
      <Button
        bsStyle="primary"
        onClick={ () => dispatch({ type: 'SHOW_RECIPE_DIALOG', action: 'add' }) }
      >Add Recipe</Button>

      <RecipeDialog { ...dialog }/>
    </div> )
})
