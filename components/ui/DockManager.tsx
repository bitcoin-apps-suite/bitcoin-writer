import React, { useState, useEffect } from 'react';
import Dock from './Dock';
import MinimalDock from './MinimalDock';

interface DockManagerProps {
  currentApp?: string;
}

const DockManager: React.FC<DockManagerProps> = ({ currentApp = 'bitcoin-writer' }) => {
  const [dockStyle, setDockStyle] = useState<'minimal' | 'large'>('minimal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get initial dock style from localStorage
    const savedDockStyle = localStorage.getItem('dockStyle') as 'minimal' | 'large' | null;
    if (savedDockStyle && (savedDockStyle === 'minimal' || savedDockStyle === 'large')) {
      setDockStyle(savedDockStyle);
    }

    // Listen for dock style changes
    const handleDockStyleChange = (event: CustomEvent) => {
      const newStyle = event.detail as 'minimal' | 'large';
      setDockStyle(newStyle);
    };

    window.addEventListener('dockStyleChanged', handleDockStyleChange as EventListener);

    return () => {
      window.removeEventListener('dockStyleChanged', handleDockStyleChange as EventListener);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {dockStyle === 'minimal' ? (
        <MinimalDock currentApp={currentApp} />
      ) : (
        <Dock currentApp={currentApp} />
      )}
    </>
  );
};

export default DockManager;