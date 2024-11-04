/* istanbul ignore file */

import axios from "axios";

const apiClient = axios.create({
  baseURL: "/v1",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('id_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;