// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3300/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (401)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // You could redirect to login here if needed
        }
        return Promise.reject(error);
    }
);

// Auth API services
export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.get('/auth/logout'),
    getProfile: () => api.get('/auth/me'),
    updateDetails: (userData) => api.put('/auth/update-details', userData),
    updatePassword: (passwordData) => api.put('/auth/update-password', passwordData),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, passwordData) => api.put(`/auth/reset-password/${token}`, passwordData)
};

// User API services
export const userService = {
    getAllUsers: () => api.get('/users'),
    getUser: (id) => api.get(`/users/${id}`),
    createUser: (userData) => api.post('/users', userData),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/users/${id}`),
    updateUserRole: (id, roleData) => api.put(`/users/${id}/role`, roleData),
    changePassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData)
};

// Product API services
export const productService = {
    getAllProducts: (params) => api.get('/products', { params }),
    getProductById: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    searchProducts: (query) => api.get(`/products/search?query=${query}`),
    getProductsByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
    getFeaturedProducts: () => api.get('/products/featured'),
    getRelatedProducts: (productId) => api.get(`/products/${productId}/related`)
};

// Order API services
export const orderService = {
    placeOrder: (orderData) => api.post('/orders', orderData),
    getMyOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
    cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
    updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData)
};

// Cart API services
export const cartService = {
    getCart: () => api.get('/cart'),
    addToCart: (cartData) => api.post('/cart/items', cartData),
    updateCartItem: (itemId, updateData) => api.put(`/cart/items/${itemId}`, updateData),
    removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
    clearCart: () => api.delete('/cart')
};

// Category API services
export const categoryService = {
    getCategories: () => api.get('/categories'),
    getCategoryById: (id) => api.get(`/categories/${id}`),
    createCategory: (categoryData) => api.post('/categories', categoryData),
    updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
    deleteCategory: (id) => api.delete(`/categories/${id}`)
};

// Admin API services
export const adminService = {
    // Users
    getAllUsers: () => api.get('/admin/users'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    assignUserRole: (id, roleData) => api.put(`/admin/users/${id}/role`, roleData),
    // Products
    createProduct: (productData) => api.post('/admin/products', productData),
    updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    // Orders
    getAllOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (id, statusData) => api.put(`/admin/orders/${id}/status`, statusData),
    cancelOrder: (id) => api.put(`/admin/orders/${id}/cancel`, {})
};

export default api;