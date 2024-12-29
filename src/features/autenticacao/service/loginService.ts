import axiosInstance from "../../../utils/config/seguranca/AutenticacaoAxiosInstance";
import {Login, Token} from "../model/Usuario";
import {clearAuthToken, setAuthToken} from "@utils/config/utils/AuthUtils";

export const loginUser = async (username: string, password: string): Promise<Token> => {
    const payload: Partial<Login> = {username, password};
    try {
        const response = await axiosInstance.post<Token>('/auth/login', payload);
        const tokenData = response.data;

        setAuthToken(tokenData.token);

        // Save token and user ID in localStorage for persistence
        localStorage.setItem('token', tokenData.token);
        localStorage.setItem('userId', tokenData.id.toString());

        return tokenData;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async (): Promise<string> => {
    try {
        const response = await axiosInstance.post<string>('/auth/logout');
        clearAuthToken();

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateToken = async (token: string): Promise<Token> => {
    const response = await axiosInstance.get<Token>(`/auth/validar-token`, {
        params: {token},
    });
    return response.data;
};

export const sendResetPasswordEmail = async (email: string): Promise<string> => {
    try {
        const response = await axiosInstance.post<string>('/auth/esqueceu-senha', {email});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
    try {
        const response = await axiosInstance.post<string>('/auth/reset-senha', {token, newPassword});
        return response.data;
    } catch (error) {
        throw error;
    }
};
