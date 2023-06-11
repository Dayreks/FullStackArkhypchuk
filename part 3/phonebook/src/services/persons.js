import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const requestHandler = async (method, url, data=null) => {
  const response = await axios({
    method,
    url,
    data,
  });
  return response.data;
}

const getAll = () => requestHandler('get', baseUrl);

const createContact = newObject => requestHandler('post', baseUrl, newObject);

const deleteContact = id => requestHandler('delete', `${baseUrl}/${id}`);

const updateContact = (id, newObject) => requestHandler('put', `${baseUrl}/${id}`, newObject);

export default { getAll, createContact, deleteContact, updateContact };
