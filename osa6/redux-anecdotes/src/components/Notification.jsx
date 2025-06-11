import { useSelector } from 'react-redux'

const Notification = () => {
  const notication = useSelector(state => state.notication)
  if (notication === '') {
    return null
  }
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: 'green',
    color: 'green',
  }
  return (
    <div style={style}>
      {notication}
    </div>
  )
}

export default Notification