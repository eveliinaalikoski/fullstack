import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <Alert variant="danger">{message}</Alert>;
};

export default ErrorMessage;
