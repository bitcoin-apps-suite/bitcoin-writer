import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './AIChatWindow.css';
import { AIService } from '../services/AIService';
import { HandCashService } from '../services/HandCashService';
import AISettingsModal from './AISettingsModal';

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
  const [showSettings, setShowSettings] = useState(false);
  const [conversationContext, setConversationContext] = useState<any[]>([]);
  // Initialize position in center-right of screen
  const [controlledPosition, setControlledPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - 440 : 100, 
    y: typeof window !== 'undefined' ? (window.innerHeight - 500) / 2 : 100 
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const providers = [
    { id: 'gemini', name: 'Gemini AI', icon: '✨' },
    { id: 'openai', name: 'OpenAI GPT', icon: '🤖' },
    { id: 'claude', name: 'Claude', icon: '🎭' },
    { id: 'local', name: 'Local LLM', icon: '💻' }
  ];

  const quickPrompts = [
    { label: 'Improve Writing', prompt: 'Please improve the following text for clarity and style: ' },
    { label: 'Fix Grammar', prompt: 'Please fix any grammar and spelling errors in: ' },
    { label: 'Make Concise', prompt: 'Please make this text more concise while keeping the key points: ' },
    { label: 'Expand Ideas', prompt: 'Please expand on these ideas with more detail: ' },
    { label: 'Create Outline', prompt: 'Please create a detailed outline for: ' },
    { label: 'Summarize', prompt: 'Please provide a summary of: ' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDrag = (e: any, data: any) => {
    setControlledPosition({ x: data.x, y: data.y });
  };

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
    const userInput = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetchAIResponse(userInput, selectedProvider);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation context
      setConversationContext(prev => [...prev, 
        { role: 'user', content: userInput },
        { role: 'assistant', content: response }
      ].slice(-10)); // Keep last 10 messages for context
      
    } catch (error: any) {
      console.error('Error fetching AI response:', error);
      
      let errorContent = 'Sorry, I encountered an error. ';
      
      if (error.message.includes('API key')) {
        errorContent += 'Please configure your API key in settings (⚙️).';
        setShowSettings(true);
      } else if (error.message.includes('network')) {
        errorContent += 'Please check your internet connection and try again.';
      } else if (error.message.includes('rate limit')) {
        errorContent += 'Rate limit reached. Please wait a moment and try again.';
      } else {
        errorContent += error.message || 'Please try again.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
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


  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearConversation = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
      setConversationContext([]);
    }
  };

  if (!isOpen) return null;

  return (
    <Draggable
      handle=".drag-handle"
      position={controlledPosition}
      onDrag={handleDrag}
      bounds={{ left: 0, top: 0, right: window.innerWidth - 400, bottom: window.innerHeight - 100 }}
      defaultPosition={{ x: window.innerWidth - 440, y: (window.innerHeight - 500) / 2 }}
    >
      <div 
        className={`ai-chat-window ${isMinimized ? 'minimized' : ''}`} 
        ref={chatContainerRef}
      >
        <div 
          className="ai-chat-header drag-handle"
        >
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
          {messages.length > 0 && (
            <>
              <button
                className="ai-chat-control-btn"
                onClick={exportConversation}
                title="Export Conversation"
              >
                💾
              </button>
              <button
                className="ai-chat-control-btn"
                onClick={clearConversation}
                title="Clear Conversation"
              >
                🗑️
              </button>
            </>
          )}
          <button
            className="ai-chat-control-btn"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            ⚙️
          </button>
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
                
                <div className="ai-quick-actions">
                  <p className="ai-quick-actions-title">Quick Actions:</p>
                  <div className="ai-quick-action-buttons">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        className="ai-quick-action-btn"
                        onClick={() => setInputMessage(prompt.prompt)}
                      >
                        {prompt.label}
                      </button>
                    ))}
                  </div>
                </div>
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
      
        <AISettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          aiService={aiService}
        />
      </div>
    </Draggable>
  );
};

export default AIChatWindow;