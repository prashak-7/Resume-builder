import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        window.location.href = "/";
      } else if (err.response.status === 500) {
        console.error("Server Error");
      }
    } else if (err.code === "ECONNABORTED") {
      console.error("Request timeout");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
