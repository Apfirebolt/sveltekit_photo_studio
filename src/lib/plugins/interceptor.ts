import axios from 'axios';

// Create an Axios instance with a base URL
const apiClient = axios.create({
    baseURL: 'https://api.tvmaze.com/', // Replace with your base URL
    timeout: 10000, // Optional: Set a timeout for requests
});

// Request interceptor
apiClient.interceptors.request.use(
    (config: any) => {
        // Modify the request config if needed (e.g., add headers)
        return config;
    },
    (error: any) => {
        // Handle request errors
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: any) => {
        // Handle successful responses
        return response;
    },
    (error: any) => {
        // Handle response errors
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

export default apiClient;