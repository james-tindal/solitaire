import createFoundation from 'components/foundation'

export default React => () => {
  const Foundation = createFoundation(React)

  return (
    <div>
      <Foundation />
      <Foundation />
      <Foundation />
      <Foundation />
    </div>
  )
}
