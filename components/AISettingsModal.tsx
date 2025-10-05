import React, { useState, useEffect } from 'react';
import './AISettingsModal.css';
import { AIService } from '../services/AIService';
import { HandCashService } from '../services/HandCashService';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiService: AIService;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, aiService }) => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    gemini: '',
    openai: '',
    claude: '',
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    gemini: false,
    openai: false,
    claude: false,
  });
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Load existing keys (masked)
      const providers = ['gemini', 'openai', 'claude'];
      const loadedKeys: Record<string, string> = {};
      
      providers.forEach(provider => {
        if (aiService.hasApiKey(provider)) {
          loadedKeys[provider] = '••••••••••••••••';
        }
      });
      
      setApiKeys(loadedKeys);
    }
  }, [isOpen, aiService]);

  const handleSaveKey = (provider: string) => {
    const key = apiKeys[provider];
    if (key && !key.includes('•')) {
      aiService.setApiKey(provider, key);
      setSaveStatus(`${provider} API key saved successfully!`);
      
      // Mask the key after saving
      setApiKeys(prev => ({
        ...prev,
        [provider]: '••••••••••••••••'
      }));
      
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleClearKey = (provider: string) => {
    aiService.setApiKey(provider, '');
    setApiKeys(prev => ({
      ...prev,
      [provider]: ''
    }));
    setSaveStatus(`${provider} API key cleared`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-settings-modal-overlay" onClick={onClose}>
      <div className="ai-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-settings-header">
          <h2>AI Assistant Settings</h2>
          <button className="ai-settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="ai-settings-content">
          <p className="ai-settings-intro">
            Configure your API keys to enable AI providers. Your keys are stored locally in your browser.
          </p>

          {saveStatus && (
            <div className="ai-settings-status">
              {saveStatus}
            </div>
          )}

          <div className="ai-provider-settings">
            <div className="ai-provider-section">
              <div className="ai-provider-header">
                <span className="ai-provider-icon">✨</span>
                <h3>Gemini AI</h3>
              </div>
              <p className="ai-provider-description">
                Google's advanced AI model. Get your API key from{' '}
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  Google AI Studio
                </a>
              </p>
              <div className="ai-key-input-group">
                <input
                  type={showKeys.gemini ? 'text' : 'password'}
                  placeholder="Enter Gemini API key..."
                  value={apiKeys.gemini || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                  className="ai-key-input"
                />
                <button
                  onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                  className="ai-key-toggle"
                >
                  {showKeys.gemini ? '🙈' : '👁️'}
                </button>
                <button
                  onClick={() => handleSaveKey('gemini')}
                  className="ai-key-save"
                  disabled={!apiKeys.gemini || apiKeys.gemini.includes('•')}
                >
                  Save
                </button>
                <button
                  onClick={() => handleClearKey('gemini')}
                  className="ai-key-clear"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="ai-provider-section">
              <div className="ai-provider-header">
                <span className="ai-provider-icon">🤖</span>
                <h3>OpenAI GPT</h3>
              </div>
              <p className="ai-provider-description">
                OpenAI's GPT models. Get your API key from{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  OpenAI Platform
                </a>
              </p>
              <div className="ai-key-input-group">
                <input
                  type={showKeys.openai ? 'text' : 'password'}
                  placeholder="Enter OpenAI API key..."
                  value={apiKeys.openai || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                  className="ai-key-input"
                />
                <button
                  onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
                  className="ai-key-toggle"
                >
                  {showKeys.openai ? '🙈' : '👁️'}
                </button>
                <button
                  onClick={() => handleSaveKey('openai')}
                  className="ai-key-save"
                  disabled={!apiKeys.openai || apiKeys.openai.includes('•')}
                >
                  Save
                </button>
                <button
                  onClick={() => handleClearKey('openai')}
                  className="ai-key-clear"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="ai-provider-section">
              <div className="ai-provider-header">
                <span className="ai-provider-icon">🎭</span>
                <h3>Claude</h3>
              </div>
              <p className="ai-provider-description">
                Anthropic's Claude AI. Get your API key from{' '}
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">
                  Anthropic Console
                </a>
              </p>
              <div className="ai-key-input-group">
                <input
                  type={showKeys.claude ? 'text' : 'password'}
                  placeholder="Enter Claude API key..."
                  value={apiKeys.claude || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, claude: e.target.value }))}
                  className="ai-key-input"
                />
                <button
                  onClick={() => setShowKeys(prev => ({ ...prev, claude: !prev.claude }))}
                  className="ai-key-toggle"
                >
                  {showKeys.claude ? '🙈' : '👁️'}
                </button>
                <button
                  onClick={() => handleSaveKey('claude')}
                  className="ai-key-save"
                  disabled={!apiKeys.claude || apiKeys.claude.includes('•')}
                >
                  Save
                </button>
                <button
                  onClick={() => handleClearKey('claude')}
                  className="ai-key-clear"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="ai-provider-section">
              <div className="ai-provider-header">
                <span className="ai-provider-icon">💻</span>
                <h3>Local LLM</h3>
              </div>
              <p className="ai-provider-description">
                Run models locally with Ollama. No API key required.{' '}
                <a href="https://ollama.ai/" target="_blank" rel="noopener noreferrer">
                  Download Ollama
                </a>
              </p>
              <div className="ai-local-status">
                <span className="ai-status-indicator">●</span>
                <span>Ready to use (no configuration needed)</span>
              </div>
            </div>
          </div>

          <div className="ai-settings-footer">
            <p className="ai-settings-note">
              💡 Your API keys are stored securely in your browser's local storage and never sent to our servers.
            </p>
            <button className="ai-settings-done" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettingsModal;