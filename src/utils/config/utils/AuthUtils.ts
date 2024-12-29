import {jwtDecode} from 'jwt-decode'; // Ensure this is installed

export const isTokenValid = (token: string): boolean => {
    try {
        if (!token) return false;
        const {exp} = jwtDecode<{ exp: number }>(token);
        return exp > Date.now() / 1000;
    } catch {
        return false;
    }
};


export const isLoggedIn = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const {exp} = jwtDecode<{ exp: number }>(token);
        return exp > Date.now() / 1000;
    } catch {
        return false;
    }
};
// Helper function to retrieve the auth token
export const getAuthToken = (): string | null => {
    return localStorage.getItem('token'); // Return the token from localStorage
};

// Helper function to save the auth token
export const setAuthToken = (token: string): void => {
    localStorage.setItem('token', token); // Save the token to localStorage
};

// Helper function to clear the auth token
export const clearAuthToken = (): void => {
    localStorage.removeItem('token'); // Remove the token from localStorage
};

