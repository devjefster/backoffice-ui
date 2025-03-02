import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../utils/contexts/AuthContext";

const ProtectedRoute: React.FC = () => {
    const {isAuthenticated, isLoading} = useAuth();

    // Show a loader while checking authentication status
    if (isLoading) {
        return <div>Loading...</div>; // Replace with a spinner or loader component
    }

    // Redirect to login if not authenticated
    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>;
};

export default ProtectedRoute;
