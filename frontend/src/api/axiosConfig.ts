import axios from 'axios';
import { API_URL } from '../main';

// Crear una instancia de axios con la URL base
const api = axios.create({
    baseURL: API_URL
});

// Interceptor para manejar la inclusión del token en todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Verificar si el error es por token expirado
        if (error.response && error.response.status === 401 && 
            error.response.data && error.response.data.error === 'TOKEN_EXPIRED') {
            
            // Limpiar el token expirado
            localStorage.removeItem('authToken');
            
            // Redirigir al login
            window.location.href = '/login?expired=true';
            
            // Mensaje para el usuario
            alert('Su sesión ha expirado. Por favor inicie sesión nuevamente.');
        }
        
        return Promise.reject(error);
    }
);

export default api;
