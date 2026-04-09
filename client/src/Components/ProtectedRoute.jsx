import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { user, loadingUser } = useAppContext();

    if (loadingUser) {
        // You can return a spinner here if you have one
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/register" replace />;
    }

    return children;
};

export default ProtectedRoute;
