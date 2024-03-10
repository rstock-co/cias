import './App.css';
import { AuthProvider } from './auth/google';
import { GOOGLE_CLIENT_ID } from '../src/lib/data/';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadWallet from './components/loadWallet/';
import React from 'react';

function App() {
  return (
    <div>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <LoadWallet />
        </AuthProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
