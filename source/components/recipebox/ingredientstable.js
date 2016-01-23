import { ListGroup, ListGroupItem } from 'react-bootstrap'

export default React => ({ ingredients }) =>
  <ListGroup>{
    ingredients.map( ingredient =>
      <ListGroupItem>{ingredient}</ListGroupItem> )
  }</ListGroup>
