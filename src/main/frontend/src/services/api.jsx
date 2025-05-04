import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8093',
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

let isLoggingOut = false;

api.interceptors.response.use(
    response => response,
    async error => {
        const status = error.response?.status;

        if(status === 401 && !isLoggingOut) {
            isLoggingOut = true;

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            alert("시간이 너무 지나서 자동 로그아웃 되었어요! 다시 로그인 해주세요!");
            window.location.href = "/user/login";
        }    
        
        return Promise.reject(error);
    }
)

export const getData = async (endpoint, config = {}) => {
    try {
        const response = await api.get(endpoint, config);
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const postData = async (endpoint, data = {}) => {
    try {
        const response = await api.post(endpoint, data);
        const { data: resData, status } = response;
        return { data: resData, status };
    } catch (error) {
        console.error("Error Post data:", error);
        throw error;
    }
};

export const deleteData = async (endpoint, config = {}) => {
    try {
        const response = await api.delete(endpoint, config);
        return response;
    } catch (error) {
        console.log("Error Delete data:", error);
        throw error;
    }
}

export default api;