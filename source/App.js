import createTitle from 'components/title'
import createRecipeBox from 'components/recipebox'

export default React => ({ title, store }) => {
  const Title = createTitle(React)
  const RecipeBox = createRecipeBox(React)

  return (
    <div className="content container">
      <Title>{ title }</Title>
      <RecipeBox { ...store.getState() } />
    </div> )
}
