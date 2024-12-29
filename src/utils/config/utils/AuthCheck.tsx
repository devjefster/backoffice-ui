import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {isTokenValid} from "./AuthUtils";
import {Spinner} from "flowbite-react";

interface AuthCheckProps {
    children: React.ReactNode;
}

// src/utils/AuthCheck.tsx
const AuthCheck: React.FC<AuthCheckProps> = ({children}) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const token = localStorage.getItem("token");
                const isAuthenticated = token && isTokenValid(token);
                if (!isAuthenticated) {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error validating token:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };


        checkAuthentication();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner color="primary"/>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthCheck;


