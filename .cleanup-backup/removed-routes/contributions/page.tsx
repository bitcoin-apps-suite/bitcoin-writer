'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function ContributionsRedirect() {
  useEffect(() => {
    // Redirect to contracts page with contributors tab
    window.location.href = '/contracts#contributors';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #f7931a',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>Redirecting to contracts page...</p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}