import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { getStorage } from '../utilities/cssfunction';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    console.log("isAuthenticated : ", isAuthenticated)
    return getStorage("access_token","string") ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;