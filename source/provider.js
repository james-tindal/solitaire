
export default React => {

  const Provider = ({ children, dispatch }) => {
    Provider.prototype.getChildContext = () => ({ dispatch })
    Provider.childContextTypes = { dispatch: React.PropTypes.func }
    Provider.prototype.render = () => children
  }

  return Provider
}
