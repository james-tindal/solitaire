import { Panel } from 'react-bootstrap'
import createIngredientsTable from 'components/recipebox/ingredientstable'
import createOptions from 'components/recipebox/options'

//takes recipe id and exports edit + delete button. edits recipe
export default React => ({ id, name, ingredients }) => {
  const IngredientsTable = createIngredientsTable(React)
  const Options = createOptions(React)

  return (
    <Panel collapsible header={name} bsStyle="info">
      <h4 className="text-center">Ingredients</h4>
      <IngredientsTable ingredients={ingredients}/>
      <Options id={id}/>
    </Panel> )
}
