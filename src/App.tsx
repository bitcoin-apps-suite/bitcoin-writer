import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import DocumentEditor from './components/DocumentEditor';
import Login from './components/Login';
import HandCashCallback from './components/HandCashCallback';
import { BlockchainDocumentService } from './services/BlockchainDocumentService';
import { HandCashService, HandCashUser } from './services/HandCashService';

function App() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null);
  const [handcashService] = useState<HandCashService>(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're coming back from HandCash with an authToken
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    
    // Check multiple possible parameter names HandCash might use
    const authToken = urlParams.get('authToken') || 
                     urlParams.get('auth_token') || 
                     urlParams.get('access_token') || 
                     urlParams.get('token') ||
                     hashParams.get('authToken') ||
                     hashParams.get('auth_token') ||
                     hashParams.get('access_token') ||
                     hashParams.get('token');
    
    console.log('App loading - URL:', window.location.href);
    console.log('URL params:', Array.from(urlParams.entries()));
    console.log('Hash params:', Array.from(hashParams.entries()));
    console.log('Auth token found:', authToken);
    
    if (authToken) {
      // We have an authToken, handle the callback
      console.log('Found authToken, handling callback...');
      const handcashService = new HandCashService();
      handcashService.handleCallback(authToken).then(user => {
        handleLogin(user);
        // Clean up URL after successful auth
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch(err => {
        console.error('Failed to handle callback:', err);
      });
    } else {
      checkAuthentication();
    }
  }, []);

  const checkAuthentication = () => {
    // Check if user is already logged in
    if (handcashService.isAuthenticated()) {
      const user = handcashService.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
      initializeDocumentService();
    }
    setIsLoading(false);
  };

  const initializeDocumentService = async () => {
    const service = new BlockchainDocumentService(handcashService);
    await service.reconnect();
    setDocumentService(service);
  };

  const handleLogin = (user: HandCashUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    initializeDocumentService();
  };

  const handleLogout = () => {
    // Clear EVERYTHING
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Reset state
    setIsAuthenticated(false);
    setCurrentUser(null);
    setDocumentService(null);
    
    // Force hard reload to clear all memory
    window.location.replace('/');
  };

  return (
    <Routes>
      <Route path="/auth/handcash/callback" element={<HandCashCallback />} />
      <Route path="/*" element={
        isLoading ? (
          <div className="App">
            <div className="loading">Loading Screen Writer...</div>
          </div>
        ) : !isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="App">
            <header className="App-header">
              <div className="connection-indicator" />
              <h1>Screen Writer</h1>
              <div className="user-info">
                <span className="user-handle">@{currentUser?.handle}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </header>
            <div className="disclaimer">
              <small>Your documents are encrypted and stored on the blockchain. Only you can read them with your HandCash login.</small>
            </div>
            <main>
              {documentService ? (
                <DocumentEditor documentService={documentService} />
              ) : (
                <div className="loading">Initializing blockchain connection...</div>
              )}
            </main>
          </div>
        )
      } />
    </Routes>
  );
}

export default App;