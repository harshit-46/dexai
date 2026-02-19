// src/components/AuthRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // or a spinner/loading screen
    return user ? children : <Navigate to="/login" replace />;
};

export default AuthRoute;
