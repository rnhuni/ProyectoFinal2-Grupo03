import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'https://api.abcallg03.com/v1', 
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let token: string | null = null;

export const setToken = (newToken: string) => {
    token = newToken;
};


// Interceptor para las solicitudes
api.interceptors.request.use(
    (config) => {
        // Aquí puedes acceder a la URL de la solicitud
        // console.log('Request URL:', config.url); // Imprime la URL de la solicitud
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Maneja el error de la solicitud
        return Promise.reject(error);
    }
);

export default api;
