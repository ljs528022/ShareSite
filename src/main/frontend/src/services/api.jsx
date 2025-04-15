import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8093',
    headers: {
        "Content-Type": 'application/json'
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let subscribers = [];

function onRefreshed(newToken) {
    subscribers.forEach(callback => callback(newToken));
    subscribers = [];
}

function addSubscriber(callback) {
    subscribers.push(callback);
}

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if(isRefreshing) {
                return new Promise(resolve => {
                    addSubscriber(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");
            try {
                const { data } = await postData("/auth/refresh", {
                    refreshToken,
                });

                localStorage.setItem("token", data.accessToken);
                isRefreshing = false;
                onRefreshed(data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/user/login";
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
)

export const getData = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const postData = async (endpoint, data = {}) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error("Error Post data:", error);
        throw error;
    }
};

export default api;