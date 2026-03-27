import axios from "axios";
import { clearAuthStorage, getToken } from "../utils/storage";

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000
});

http.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearAuthStorage();
    }

    return Promise.reject(error);
  }
);

export default http;
