import axios from 'axios';
import { useAuthStore } from '../store';
import { AUTH_SERVICE } from './api';
import { mockAdapter } from './mock';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    adapter: useMock ? mockAdapter : undefined,
});

const refreshToken = async () => {
    await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}${AUTH_SERVICE}/auth/refresh`,
        {},
        {
            withCredentials: true,
            adapter: useMock ? mockAdapter : undefined,
        }
    );
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._isRetry) {
            try {
                originalRequest._isRetry = true;
                const headers = { ...originalRequest.headers };
                await refreshToken();
                return api.request({ ...originalRequest, headers });
            } catch (err) {
                console.error('Token refresh error', err);
                useAuthStore.getState().logout();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
