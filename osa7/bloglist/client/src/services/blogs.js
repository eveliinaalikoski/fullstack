import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(baseUrl, config);
  return request.then((response) => response.data);
};

const getBlogById = (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(`${baseUrl}/${id}`, config);
  return request.then((response) => response.data);
};

const getComments = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(`${baseUrl}/${id}`, config);
  return response.data.comments;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const like = async (likedBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(
    `${baseUrl}/${likedBlog.id}`,
    likedBlog,
    config,
  );
  return response.data;
};

const deletion = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response.data;
};

export default {
  setToken,
  getAll,
  getBlogById,
  getComments,
  create,
  like,
  deletion,
};
