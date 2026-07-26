import axios from "axios";

const TOKEN_KEY = "ii_token";

const api = axios.create({
  baseURL: 'https://inside-invoice-backend.onrender.com/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem("token");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
