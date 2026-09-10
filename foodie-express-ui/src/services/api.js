import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

API.interceptors.request.use((config) => {
    const savedUser = localStorage.getItem('foodie_user');
    if (savedUser) {
        try {
            const { accessToken, token } = JSON.parse(savedUser);
            const authToken = accessToken || token;
            if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
        } catch {}
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.response?.data?.error;

        if (status === 401) {
            localStorage.removeItem('foodie_user');
            localStorage.removeItem('token');
            toast.error("Session expired. Please login again.");
            window.location.href = '/login';
        } else if (status === 403) {
            toast.error("You don't have permission to do this.");
        } else if (status === 404) {
            toast.error(message || "Resource not found.");
        } else if (status === 409) {
            toast.error(message || "This resource already exists.");
        } else if (status === 500) {
            toast.error("Server error! Our kitchen is having issues.");
        } else if (status === 503) {
            toast.error("Service temporarily unavailable. Try again later.");
        } else if (!error.response) {
            toast.error("Network error! Check your connection.");
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (creds) => API.post('/auth/login', creds),
    register: (data) => API.post('/auth/register', data),
    getDeliveryPartners: () => API.get('/auth/delivery-partners'),
    updateProfile: (data) => API.put('/auth/profile', data),
    changePassword: (data) => API.put('/auth/password', data),
};

export const restaurantService = {
    getAllRestaurants: () => API.get('/restaurants'),
    getRestaurantsByCity: (city) => API.get(`/restaurants/city/${city}`),
    getRestaurantById: (id) => API.get(`/restaurants/${id}`),
    addMenuItem: (restaurantId, item) => API.post(`/restaurants/${restaurantId}/menu`, item),
    updateMenuItem: (restaurantId, itemId, item) => API.put(`/restaurants/${restaurantId}/menu/${itemId}`, item),
    deleteMenuItem: (restaurantId, itemId) => API.delete(`/restaurants/${restaurantId}/menu/${itemId}`),
};

export const paymentService = {
    createOrder: (data) => API.post('/payments/create-order', data),
    verifyPayment: (data) => API.post('/payments/verify', data),
};

export const orderService = {
    placeOrder: (data) => API.post('/orders', data),
    validatePromo: (data) => API.post('/orders/promos/validate', data),
    listPromos: () => API.get('/orders/promos'),
    getUserOrders: (email) => API.get(`/orders/${email}`),
    getAllOrders: () => API.get('/orders/all'),
    updateOrderStatus: (id, status) => API.put(`/orders/${id}/status?status=${status}`),
    assignDeliveryPartner: (id, email) => API.put(`/orders/${id}/assign?deliveryPartnerEmail=${email}`),
    getDeliveryPartnerOrders: (email) => API.get(`/orders/assigned/${email}`),
    getRestaurantOrders: (name) => API.get(`/orders/restaurant/${name}`),
};

export default API;