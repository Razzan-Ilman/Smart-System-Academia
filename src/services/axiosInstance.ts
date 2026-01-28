import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Variables for refresh token queue management
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with automatic token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            // No refresh token available, redirect to login
            if (!refreshToken) {
                console.error('❌ No refresh token available - redirecting to login');
                localStorage.clear();
                window.location.href = '/admin/login';
                return Promise.reject(error);
            }

            try {

                // Call refresh token API
                const response = await axiosInstance.put('/user/refresh-token', {
                    refreshToken: refreshToken
                });

                const newAccessToken = response.data?.access_token || response.data?.data?.access_token;

                if (newAccessToken) {

                    // Store new access token
                    localStorage.setItem('admin_token', newAccessToken);

                    // Store new refresh token if provided
                    const newRefreshToken = response.data?.refresh_token || response.data?.data?.refresh_token;
                    if (newRefreshToken) {
                        localStorage.setItem('refresh_token', newRefreshToken);
                    }

                    // Update authorization header
                    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

                    // Process queued requests
                    processQueue(null, newAccessToken);

                    // Retry original request
                    return axiosInstance(originalRequest);
                } else {
                    throw new Error('No access token in refresh response');
                }
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other errors
        if (error.response) {
            // Clean logging only in Development
            if (import.meta.env.DEV) {
                switch (error.response.status) {
                    case 403:
                        console.error('Forbidden access');
                        break;
                    case 404:
                        console.warn(`Resource not found: ${error.config?.url}`);
                        break;
                    case 500:
                        console.error('Server error');
                        break;
                    default:
                        console.error('An error occurred:', error.response.data);
                }
            }
        } else if (error.request) {
            if (import.meta.env.DEV) console.error('No response received:', error.request);
        } else {
            if (import.meta.env.DEV) console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
