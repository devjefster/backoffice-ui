import axios, {AxiosError, AxiosInstance} from 'axios';
import {getAuthToken, isLoggedIn} from '../utils/AuthUtils';
import {useNavigate} from "react-router-dom";

const createAxiosInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config) => {
            const unauthenticatedEndpoints = [
                '/auth/login',
                '/auth/esqueceu-senha',
                '/usuario/criar',
                '/auth/logout',
            ];
            const isUnauthenticatedRequest = unauthenticatedEndpoints.some((endpoint) =>
                config.url?.includes(endpoint)
            );

            if (!isUnauthenticatedRequest) {
                console.log('isUnauthenticatedRequest',isUnauthenticatedRequest);
                const token = getAuthToken();
                if (token) {
                    config.headers = {...config.headers, Authorization: `Bearer ${token}`};
                } else if (!isLoggedIn()) {
                    console.warn('User is not authenticated. Redirect to login.');

                }
            }

            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                const navigate = useNavigate();
                navigate("/login"); // Redirect to login page
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default createAxiosInstance;
