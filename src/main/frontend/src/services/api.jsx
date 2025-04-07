import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8093',
    headers: {
        "Content-Type": 'application/json'
    },
    withCredentials: true,
});

export const getData = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const postData = async (endpoint) => {
    try {
        const response = await api.post(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error Post data:", error);
        throw error;
    }
};