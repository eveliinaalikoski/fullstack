import { Alert } from 'react-bootstrap';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <Alert variant="success">{message}</Alert>;
};

export default Notification;
