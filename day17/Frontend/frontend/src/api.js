import axios from 'axios';
import { store } from './store/store';
import { logout } from './store/authSlice';
import { message } from 'antd';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.message || 'Request failed';
    if (error.response && error.response.status === 401) {
      message.error(errorMsg);
      store.dispatch(logout()); // Auto-logout on expired/invalid token
    } else if (error.response && error.response.status === 403) {
      message.error(errorMsg);
    }
    return Promise.reject(error);
  }
);

export default API;