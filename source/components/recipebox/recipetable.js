import { Well } from 'react-bootstrap'
import createRecipeRow from 'components/recipebox/reciperow'

export default React => ({ recipes }) => {
  const RecipeRow = createRecipeRow(React)

  const recipesK = Object.keys(recipes)
  const RecipeTable =
    <Well className="panel-group">{
      recipesK.map(( recipe, index ) =>
        <RecipeRow key={recipes[index].id} { ...recipes[index] } /> )
    }</Well>

  RecipeTable.propTypes = { recipes: React.PropTypes.object }

  return RecipeTable
}
