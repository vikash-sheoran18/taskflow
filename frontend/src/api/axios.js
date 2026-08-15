import axios from 'axios';

const api = axios.create({
  baseURL: 'https://taskflow-backend-oib6.onrender.com/api',
});

export default api;