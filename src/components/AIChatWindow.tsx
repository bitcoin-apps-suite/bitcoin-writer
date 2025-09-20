import React, { useState, useRef, useEffect } from 'react';
import './AIChatWindow.css';
import { AIService } from '../services/AIService';
import { HandCashService } from '../services/HandCashService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  edited?: boolean;
}

interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToDocument: (text: string) => void;
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({
  isOpen,
  onClose,
  onInsertToDocument,
  selectedProvider,
  onProviderChange
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiService] = useState(() => new AIService(new HandCashService()));
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const providers = [
    { id: 'gemini', name: 'Gemini AI', icon: '✨' },
    { id: 'openai', name: 'OpenAI GPT', icon: '🤖' },
    { id: 'claude', name: 'Claude', icon: '🎭' },
    { id: 'local', name: 'Local LLM', icon: '💻' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetchAIResponse(inputMessage.trim(), selectedProvider);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAIResponse = async (prompt: string, provider: string): Promise<string> => {
    try {
      // Check if API key is needed and not present
      if (!aiService.hasApiKey(provider) && provider !== 'local') {
        setShowApiKeyInput(true);
        throw new Error(`Please configure your ${provider} API key first.`);
      }

      // Convert messages to the format expected by the AI service
      const context = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await aiService.generateResponse(prompt, provider, context);
      return response.content;
    } catch (error: any) {
      console.error('AI service error:', error);
      throw error;
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
  };

  const handleSaveEdit = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: editedContent, edited: true }
        : msg
    ));
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleInsertToDocument = (content: string) => {
    onInsertToDocument(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`ai-chat-window ${isMinimized ? 'minimized' : ''}`} ref={chatContainerRef}>
      <div className="ai-chat-header">
        <div className="ai-chat-header-left">
          <span className="ai-chat-title">AI Assistant</span>
          <select 
            className="ai-provider-selector"
            value={selectedProvider}
            onChange={(e) => onProviderChange(e.target.value)}
          >
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.icon} {provider.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ai-chat-controls">
          <button 
            className="ai-chat-control-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? '□' : '─'}
          </button>
          <button 
            className="ai-chat-control-btn"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {showApiKeyInput && (
            <div className="ai-api-key-prompt">
              <p>Please enter your {providers.find(p => p.id === selectedProvider)?.name} API key:</p>
              <input
                type="password"
                placeholder="Enter API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="ai-api-key-input"
              />
              <div className="ai-api-key-buttons">
                <button
                  onClick={() => {
                    aiService.setApiKey(selectedProvider, apiKey);
                    setShowApiKeyInput(false);
                    setApiKey('');
                  }}
                  disabled={!apiKey}
                >
                  Save Key
                </button>
                <button onClick={() => setShowApiKeyInput(false)}>Cancel</button>
              </div>
              <p className="ai-api-key-note">
                Your API key will be stored locally in your browser.
              </p>
            </div>
          )}
          <div className="ai-chat-messages">
            {messages.length === 0 ? (
              <div className="ai-chat-welcome">
                <p>👋 Hi! I'm your AI writing assistant.</p>
                <p>Ask me to help with your document, generate ideas, or improve your writing.</p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`ai-message ${message.role}`}>
                  <div className="ai-message-header">
                    <span className="ai-message-role">
                      {message.role === 'user' ? '👤 You' : '🤖 AI'}
                    </span>
                    {message.edited && <span className="ai-message-edited">(edited)</span>}
                    <span className="ai-message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {editingMessageId === message.id ? (
                    <div className="ai-message-edit">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="ai-message-edit-input"
                        autoFocus
                      />
                      <div className="ai-message-edit-buttons">
                        <button onClick={() => handleSaveEdit(message.id)}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="ai-message-content">
                      <div className="ai-message-text">{message.content}</div>
                      <div className="ai-message-actions">
                        <button
                          className="ai-message-action"
                          onClick={() => handleEditMessage(message.id, message.content)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        {message.role === 'assistant' && (
                          <button
                            className="ai-message-action"
                            onClick={() => handleInsertToDocument(message.content)}
                            title="Insert to document"
                          >
                            📄 Insert
                          </button>
                        )}
                        <button
                          className="ai-message-action"
                          onClick={() => navigator.clipboard.writeText(message.content)}
                          title="Copy"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="ai-message assistant">
                <div className="ai-message-header">
                  <span className="ai-message-role">🤖 AI</span>
                </div>
                <div className="ai-message-content">
                  <div className="ai-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input-container">
            <textarea
              className="ai-chat-input"
              placeholder="Ask AI to help with your writing..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="ai-chat-send"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChatWindow;