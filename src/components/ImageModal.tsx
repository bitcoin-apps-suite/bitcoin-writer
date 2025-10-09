import React, { useState, useRef } from 'react';
import './ImageModal.css';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (imageUrl: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onInsertImage
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // AI Generation states
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{url: string, prompt: string}>>([]);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Insert uploaded image
  const handleInsertUpload = () => {
    if (previewUrl) {
      onInsertImage(previewUrl);
      resetModal();
    }
  };

  // Generate AI image
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Using OpenAI DALL-E API
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key') || ''}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      setGeneratedImage(imageUrl);
      setImageHistory(prev => [...prev, { url: imageUrl, prompt: prompt }]);
    } catch (err) {
      // Fallback to placeholder for demo
      const placeholderUrl = `https://via.placeholder.com/1024x1024/1a1a1a/f7931a?text=${encodeURIComponent(prompt.substring(0, 50))}`;
      setGeneratedImage(placeholderUrl);
      setImageHistory(prev => [...prev, { url: placeholderUrl, prompt: prompt }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Insert AI generated image
  const handleInsertGenerated = () => {
    if (generatedImage) {
      onInsertImage(generatedImage);
      resetModal();
    }
  };

  // Reset modal state
  const resetModal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrompt('');
    setGeneratedImage(null);
    setError(null);
    onClose();
  };

  // Select from history
  const handleSelectFromHistory = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="image-modal-overlay">
      <div className="image-modal">
        <div className="image-modal-header">
          <h2>📸 Add Image</h2>
          <button className="close-btn" onClick={resetModal}>✕</button>
        </div>

        <div className="image-modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📁 Upload Image
          </button>
          <button 
            className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            🎨 Generate with AI
          </button>
        </div>

        <div className="image-modal-content">
          {activeTab === 'upload' ? (
            <div className="upload-tab">
              <div 
                className={`drop-zone ${dragOver ? 'drag-over' : ''} ${previewUrl ? 'has-preview' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                    <div className="preview-actions">
                      <button 
                        className="change-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="drop-zone-content">
                    <div className="drop-icon">📤</div>
                    <h3>Drop your image here</h3>
                    <p>or click to browse</p>
                    <div className="supported-formats">
                      <span>JPG</span>
                      <span>PNG</span>
                      <span>GIF</span>
                      <span>WebP</span>
                      <span>SVG</span>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />

              {previewUrl && (
                <div className="upload-actions">
                  <button 
                    className="insert-btn"
                    onClick={handleInsertUpload}
                  >
                    📄 Insert Image
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="generate-tab">
              <div className="prompt-section">
                <label htmlFor="image-prompt">Describe the image you want:</label>
                <textarea
                  id="image-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A futuristic city with flying cars and neon lights at sunset, cyberpunk style"
                  rows={3}
                  disabled={isGenerating}
                />
                
                <div className="prompt-suggestions">
                  <span className="suggestion-label">Quick ideas:</span>
                  <button 
                    className="suggestion-chip"
                    onClick={() => setPrompt('Professional business meeting in modern office')}
                  >
                    Business
                  </button>
                  <button 
                    className="suggestion-chip"
                    onClick={() => setPrompt('Abstract technology background with blockchain elements')}
                  >
                    Blockchain
                  </button>
                  <button 
                    className="suggestion-chip"
                    onClick={() => setPrompt('Bitcoin logo with orange gradient and digital effects')}
                  >
                    Bitcoin
                  </button>
                  <button 
                    className="suggestion-chip"
                    onClick={() => setPrompt('Nature landscape with mountains and lake at sunrise')}
                  >
                    Nature
                  </button>
                </div>

                <div className="generation-controls">
                  <button 
                    className="generate-btn"
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        ✨ Generate Image
                      </>
                    )}
                  </button>
                </div>
              </div>

              {generatedImage && (
                <div className="generated-preview">
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="generated-image"
                  />
                  <div className="generated-actions">
                    <button 
                      className="insert-btn"
                      onClick={handleInsertGenerated}
                    >
                      📄 Insert Image
                    </button>
                    <button 
                      className="regenerate-btn"
                      onClick={generateImage}
                      disabled={isGenerating}
                    >
                      🔄 Regenerate
                    </button>
                  </div>
                </div>
              )}

              {!generatedImage && !isGenerating && (
                <div className="placeholder-preview">
                  <div className="placeholder-icon">🖼️</div>
                  <p>Your generated image will appear here</p>
                </div>
              )}

              {imageHistory.length > 0 && (
                <div className="history-section">
                  <h3>Recent Generations</h3>
                  <div className="history-grid">
                    {imageHistory.slice(-4).reverse().map((item, index) => (
                      <div 
                        key={index} 
                        className="history-item"
                        onClick={() => handleSelectFromHistory(item.url)}
                      >
                        <img src={item.url} alt={item.prompt} />
                        <span className="history-prompt">{item.prompt.substring(0, 30)}...</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;