import React, { useState, useEffect } from 'react';
import BlogEditor from '../components/BlogEditor';
import CleanTaskbar from '../components/CleanTaskbar';
import TickerSidebar from '../components/TickerSidebar';
import { HandCashService, HandCashUser } from '../services/HandCashService';

const BlogPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null);
  const handcashService = new HandCashService();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const authData = localStorage.getItem('handcash_user');
        if (authData) {
          const userData = JSON.parse(authData);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('No stored auth data');
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('handcash_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0'
    }}>
      {/* Taskbar */}
      <CleanTaskbar 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      {/* Blog Editor - takes remaining space */}
      <BlogEditor />
    </div>
  );
};

export default BlogPage;