import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('veloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle friendly error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'Unable to connect to VELoop servers. Please check your network connection.';

    if (error.response) {
      // Backend returned an error response
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('veloop_token');
        localStorage.removeItem('veloop_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login?sessionExpired=true';
        }
      }

      friendlyMessage = error.response.data?.message || 'A server error occurred. Please try again.';
    } else if (error.code === 'ECONNABORTED') {
      friendlyMessage = 'Request timed out. Please try again.';
    }

    return Promise.reject(new Error(friendlyMessage));
  }
);

export default api;
