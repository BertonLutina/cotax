import React, { createContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to log in and store the access token
    const login = (token) => {
        setAccessToken(token);
        setIsAuthenticated(true);
    };

    // Function to log out and clear the token
    const logout = () => {
        setAccessToken(null);
        setIsAuthenticated(false);
    };

    // Provide the state and functions to all children components
    return (
        <AuthContext.Provider value={{ accessToken, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};