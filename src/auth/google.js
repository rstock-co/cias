import React, { createContext, useContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    const handleLoginSuccess = (tokenResponse) => {
        console.log(tokenResponse);
        const newAccessToken = tokenResponse.access_token; // Update according to actual response structure
        setAccessToken(newAccessToken); // Update access token in context
    };

    const handleLoginFailure = () => {
        console.error('Google login failed');
    };

    // Directly include the login logic using the hook here
    const initiateGoogleLogin = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: handleLoginFailure,
        scope: 'email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/forms',
    });

    return (
        <AuthContext.Provider value={{ accessToken, initiateGoogleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

