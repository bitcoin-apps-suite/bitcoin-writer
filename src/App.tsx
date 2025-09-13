import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import DocumentEditor from './components/DocumentEditor';
import DocumentSidebar from './components/DocumentSidebar';
import Login from './components/Login';
import HandCashCallback from './components/HandCashCallback';
import { BlockchainDocumentService, BlockchainDocument } from './services/BlockchainDocumentService';
import { HandCashService, HandCashUser } from './services/HandCashService';

function App() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null);
  const [handcashService] = useState<HandCashService>(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDocument, setCurrentDocument] = useState<BlockchainDocument | null>(null);
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
    
    console.log('=== App Initialization ===');
    console.log('HandCash App ID:', process.env.REACT_APP_HANDCASH_APP_ID ? 'Configured' : 'NOT CONFIGURED');
    console.log('Current URL:', window.location.href);
    console.log('URL params:', Array.from(urlParams.entries()));
    console.log('Hash params:', Array.from(hashParams.entries()));
    console.log('Auth token found:', authToken ? 'Yes' : 'No');
    
    if (authToken) {
      // We have an authToken, handle the callback
      console.log('Found authToken, handling callback...');
      const handcashService = new HandCashService();
      handcashService.handleCallback(authToken).then(user => {
        console.log('Callback processed, user:', user);
        handleLogin(user);
        // Clean up URL after successful auth
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch(err => {
        console.error('Failed to handle callback:', err);
        alert('HandCash authentication failed. Please try again.');
      });
    } else {
      // Check existing authentication
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
    console.log('=== User Successfully Authenticated ===');
    console.log('User handle:', user.handle);
    console.log('User paymail:', user.paymail);
    console.log('=====================================');
    setCurrentUser(user);
    setIsAuthenticated(true);
    initializeDocumentService();
  };

  const handleLogout = () => {
    console.log('=== COMPLETE LOGOUT ===');
    
    // Use HandCash service logout
    handcashService.logout();
    
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
    setCurrentDocument(null);
    
    console.log('Logout complete - refreshing page...');
    
    // Force hard reload to clear all memory
    setTimeout(() => {
      window.location.replace('/');
    }, 100);
  };

  return (
    <Routes>
      <Route path="/auth/handcash/callback" element={<HandCashCallback />} />
      <Route path="/*" element={
        isLoading ? (
          <div className="App">
            <div className="loading">Loading Bitcoin Writer...</div>
          </div>
        ) : (
          <div className="App">
            <header className="App-header">
              <div className="connection-indicator" style={{ 
                backgroundColor: isAuthenticated ? '#44ff44' : '#888' 
              }} />
              <div className="title-section">
                <h1><span style={{color: '#ff9500'}}>Bitcoin</span> Writer</h1>
                <p className="subtitle">Secure, Encrypted Documents on the Blockchain</p>
              </div>
              <div className="user-info">
                {isAuthenticated ? (
                  <>
                    <div className="handcash-badge">
                      <span className="handcash-logo">HandCash</span>
                      <span className="user-handle">@{currentUser?.handle}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button className="login-btn" onClick={() => handcashService.login()}>
                    Sign in with HandCash
                  </button>
                )}
              </div>
            </header>
            <div className="disclaimer">
              <small>
                {isAuthenticated 
                  ? "Your documents are encrypted and stored on the blockchain. Only you can read them."
                  : "Start writing immediately. Sign in with HandCash to save your documents on the blockchain."}
              </small>
            </div>
            <div className="app-container">
              <DocumentSidebar
                documentService={documentService}
                isAuthenticated={isAuthenticated}
                onDocumentSelect={(doc) => setCurrentDocument(doc)}
                onNewDocument={() => setCurrentDocument(null)}
                currentDocumentId={currentDocument?.id}
              />
              <main>
                <DocumentEditor 
                  documentService={documentService} 
                  isAuthenticated={isAuthenticated}
                  onAuthRequired={() => handcashService.login()}
                  currentDocument={currentDocument}
                  onDocumentUpdate={(doc) => setCurrentDocument(doc)}
                />
              </main>
            </div>
          </div>
        )
      } />
    </Routes>
  );
}

export default App;