import api from "./axios";

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const businessAPI = {
  setup: (data) => api.post("/business/setup", data),
  getProfile: () => api.get("/business/me"),
  update: (data) => api.put("/business/update", data),
  uploadSignature: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/business/signature", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  removeSignature: () => api.delete("/business/signature"),
};

export const customerAPI = {
  create: (data) => api.post("/customers", data),
  getAll: (params) => api.get("/customers", { params }),
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  check: (data) => api.post("/customers/check", data),
};

export const productAPI = {
  create: (data) => api.post("/products", data),
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  findByHsn: (hsn) => api.get(`/products/by-hsn/${hsn}`),
};

export const invoiceAPI = {
  create: (data) => api.post("/invoices", data),
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
};

export const paymentAPI = {
  create: (data) => api.post("/payments", data),
  getAll: (params) => api.get("/payments", { params }),
  getById: (id) => api.get(`/payments/${id}`),
  getByInvoice: (invoiceId) => api.get(`/payments/by-invoice/${invoiceId}`),
  delete: (id) => api.delete(`/payments/${id}`),
};

export const adminAPI = {
  createUser: (data) => api.post("/auth/signup", { ...data, businessName: data.businessName || undefined }),
  getStats: () => api.get("/admin/stats"),
  getAllUsers: () => api.get("/admin/users"),
  getAllBusinesses: () => api.get("/admin/businesses"),
  getBusinessInvoices: (businessId) => api.get(`/admin/businesses/${businessId}/invoices`),
  getInvoice: (id) => api.get(`/admin/invoices/${id}`),
  updateInvoice: (id, data) => api.put(`/admin/invoices/${id}`, data),
  updatePassword: (id, data) => api.put(`/admin/users/${id}/password`, data),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllCustomers: () => api.get("/admin/customers"),
  getAllInvoices: () => api.get("/admin/invoices"),
  getBusiness: (id) => api.get(`/admin/businesses/${id}`),
  getAnalytics: () => api.get("/admin/analytics"),
  getAllProducts: () => api.get("/admin/products"),
};
