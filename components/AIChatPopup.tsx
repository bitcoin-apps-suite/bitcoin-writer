import React, { useEffect, useState } from 'react';
import AIChatWindow from './AIChatWindow';
import { AIService } from '../services/AIService';
import { HandCashService } from '../services/HandCashService';
import './AIChatPopup.css';

// This component renders in the popup window
const AIChatPopup: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [aiService] = useState(() => new AIService(new HandCashService()));

  useEffect(() => {
    // Listen for messages from the parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'INSERT_TO_DOCUMENT') {
        // Message will be handled by parent
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Set window title
    document.title = 'AI Writing Assistant';

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleInsertToDocument = (text: string) => {
    // Send message back to parent window
    if (window.opener) {
      window.opener.postMessage({
        type: 'INSERT_AI_TEXT',
        text: text
      }, '*');
    }
  };

  return (
    <div className="ai-popup-container">
      <AIChatWindow
        isOpen={true}
        onClose={() => window.close()}
        onInsertToDocument={handleInsertToDocument}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
      />
    </div>
  );
};

export default AIChatPopup;