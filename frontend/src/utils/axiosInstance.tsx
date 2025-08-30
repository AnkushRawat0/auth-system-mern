// frontend/src/utils/axiosInstance.tsx
import axios from 'axios';

// Create a new Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Corrected to http://localhost:5000/api
  withCredentials: true, // Crucial for sending cookies (httpOnly refresh token)
});

// Request interceptor to attach the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refreshing
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 (Unauthorized) and it's not the refresh token endpoint
    // and we haven't already tried to refresh the token for this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops

      try {
        const refreshTokenResponse = await axios.post('http://localhost:5000/api/auth/refresh-token', {}, { // Corrected URL
          withCredentials: true,
        });

        const { accessToken } = refreshTokenResponse.data; // Corrected typo

        // Update the access token in localStorage and AuthContext (if available)
        localStorage.setItem('token', accessToken);
        // Note: We can't directly call setToken from AuthContext here because this is a standalone utility.
        // We will update AuthContext to use this axiosInstance, and the AuthProvider will handle updating its state.

        // Update the authorization header for the original request
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request with the new access token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError);
        // If refresh fails, log out the user
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;