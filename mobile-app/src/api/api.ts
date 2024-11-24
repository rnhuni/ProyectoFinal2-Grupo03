import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'https://api.abcallg03.com/v2',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let token: string | null = null;

// export const setToken = (newToken: string) => {
//     token = newToken;
// };

export const setToken = (token: string) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};


// Interceptor para las solicitudes
api.interceptors.request.use(
    (config) => {
        // console.log('Request URL:', config.url); // Imprime la URL de la solicitud
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para las respuestas
// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default api;
