
import React, { createContext, useContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
  
    // Function to update the access token state
    const updateAccessToken = (newToken) => {
      setAccessToken(newToken);
    };
  
    return (
      <AuthContext.Provider value={{ accessToken, updateAccessToken }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Step 3: Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);


export const GoogleLoginButton = () => {
    const { updateAccessToken } = useAuth();
  
    const login = useGoogleLogin({
      onSuccess: tokenResponse => {
        console.log(tokenResponse);
        const accessToken = tokenResponse.access_token; // Update according to actual response structure
        updateAccessToken(accessToken); // Update access token in context
      },
      onError: () => {
        console.error('Google login failed');
      },
      scope: 'email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
    });
  
    return <button onClick={login}>Sign in with Google</button>;
  };


