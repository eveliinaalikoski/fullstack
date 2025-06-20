import axios from 'axios';
const baseUrl = '/api/users';

const getAll = async () => {
  console.log('USERSERVICE, getAll');
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export default { getAll, getUserById };
