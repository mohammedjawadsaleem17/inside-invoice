import api from "./axios";

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export const businessAPI = {
  setup: (data) => api.post("/business/setup", data),
  getProfile: () => api.get("/business/me"),
  update: (data) => api.put("/business/update", data),
};

export const customerAPI = {
  create: (data) => api.post("/customers", data),
  getAll: (params) => api.get("/customers", { params }),
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const productAPI = {
  create: (data) => api.post("/products", data),
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const invoiceAPI = {
  create: (data) => api.post("/invoices", data),
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
};

export const adminAPI = {
  createUser: (data) => api.post("/admin/users", data),
};
