import React, { useState, useRef } from 'react';
import './ImageModal.css';
import UnsplashService, { UnsplashImage } from '../services/UnsplashService';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (imageUrl: string) => void;
  documentTitle?: string;
  documentContent?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
  documentTitle,
  documentContent
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'generate' | 'unsplash'>('upload');
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
  
  // Unsplash states
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);
  const [selectedUnsplashImage, setSelectedUnsplashImage] = useState<UnsplashImage | null>(null);
  const [unsplashPage, setUnsplashPage] = useState(1);
  
  // Auto-suggest states
  const [isAutoSuggesting, setIsAutoSuggesting] = useState(false);
  const [autoSuggestedImage, setAutoSuggestedImage] = useState<string | null>(null);

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

  // Search Unsplash images
  const searchUnsplashImages = async (query: string = unsplashQuery, page: number = 1) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearchingUnsplash(true);
    setError(null);

    try {
      const result = await UnsplashService.searchImages(query, page, 12);
      if (page === 1) {
        setUnsplashImages(result.results);
      } else {
        setUnsplashImages(prev => [...prev, ...result.results]);
      }
      setUnsplashPage(page);
    } catch (err) {
      setError('Failed to search images. Please try again.');
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  // Load more Unsplash images
  const loadMoreUnsplashImages = () => {
    if (!isSearchingUnsplash) {
      searchUnsplashImages(unsplashQuery, unsplashPage + 1);
    }
  };

  // Insert Unsplash image
  const handleInsertUnsplash = () => {
    if (selectedUnsplashImage) {
      const imageUrl = UnsplashService.formatImageUrl(selectedUnsplashImage.urls.regular, 800, 500);
      onInsertImage(imageUrl);
      resetModal();
    }
  };

  // Quick search presets for Unsplash
  const handleUnsplashQuickSearch = (query: string) => {
    setUnsplashQuery(query);
    searchUnsplashImages(query, 1);
  };

  // Auto-suggest image based on document content
  const handleAutoSuggestImage = async () => {
    setIsAutoSuggesting(true);
    setError(null);

    try {
      const title = documentTitle || 'article';
      const content = documentContent || '';
      const imageUrl = await UnsplashService.autoSuggestImage(title, content);
      
      setAutoSuggestedImage(imageUrl);
      setActiveTab('upload'); // Switch to upload tab to show the suggested image
    } catch (err) {
      setError('Failed to auto-suggest image. Please try manual search.');
    } finally {
      setIsAutoSuggesting(false);
    }
  };

  // Insert auto-suggested image
  const handleInsertAutoSuggested = () => {
    if (autoSuggestedImage) {
      onInsertImage(autoSuggestedImage);
      resetModal();
    }
  };

  // Reset modal state
  const resetModal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrompt('');
    setGeneratedImage(null);
    setUnsplashQuery('');
    setUnsplashImages([]);
    setSelectedUnsplashImage(null);
    setUnsplashPage(1);
    setAutoSuggestedImage(null);
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
          <div className="header-actions">
            {(documentTitle || documentContent) && (
              <button 
                className="auto-suggest-btn"
                onClick={handleAutoSuggestImage}
                disabled={isAutoSuggesting}
                title="Automatically find a relevant image based on your content"
              >
                {isAutoSuggesting ? (
                  <>
                    <span className="spinner"></span>
                    Finding...
                  </>
                ) : (
                  <>
                    ✨ Auto-suggest
                  </>
                )}
              </button>
            )}
            <button className="close-btn" onClick={resetModal}>✕</button>
          </div>
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
          <button 
            className={`tab-btn ${activeTab === 'unsplash' ? 'active' : ''}`}
            onClick={() => setActiveTab('unsplash')}
          >
            📸 Unsplash Photos
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

              {autoSuggestedImage && !previewUrl && (
                <div className="auto-suggested-section">
                  <h3>✨ Suggested Image</h3>
                  <p>We found this image based on your content:</p>
                  <div className="auto-suggested-preview">
                    <img src={autoSuggestedImage} alt="Auto-suggested" className="auto-suggested-image" />
                    <div className="auto-suggested-actions">
                      <button 
                        className="insert-btn"
                        onClick={handleInsertAutoSuggested}
                      >
                        📄 Use This Image
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setAutoSuggestedImage(null)}
                      >
                        Find Different
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'generate' ? (
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
          ) : (
            <div className="unsplash-tab">
              <div className="unsplash-search-section">
                <div className="search-input-group">
                  <input
                    type="text"
                    value={unsplashQuery}
                    onChange={(e) => setUnsplashQuery(e.target.value)}
                    placeholder="Search for free photos..."
                    onKeyPress={(e) => e.key === 'Enter' && searchUnsplashImages()}
                    disabled={isSearchingUnsplash}
                  />
                  <button 
                    className="search-btn"
                    onClick={() => searchUnsplashImages()}
                    disabled={isSearchingUnsplash || !unsplashQuery.trim()}
                  >
                    {isSearchingUnsplash ? '🔄' : '🔍'}
                  </button>
                </div>
                
                <div className="quick-search-tags">
                  <span className="tag-label">Popular:</span>
                  <button 
                    className="tag-btn"
                    onClick={() => handleUnsplashQuickSearch('technology')}
                  >
                    Technology
                  </button>
                  <button 
                    className="tag-btn"
                    onClick={() => handleUnsplashQuickSearch('business')}
                  >
                    Business
                  </button>
                  <button 
                    className="tag-btn"
                    onClick={() => handleUnsplashQuickSearch('writing')}
                  >
                    Writing
                  </button>
                  <button 
                    className="tag-btn"
                    onClick={() => handleUnsplashQuickSearch('blockchain')}
                  >
                    Blockchain
                  </button>
                  <button 
                    className="tag-btn"
                    onClick={() => handleUnsplashQuickSearch('nature')}
                  >
                    Nature
                  </button>
                  <button 
                    className="tag-btn"
                    onClick={() => handleUnsplashQuickSearch('abstract')}
                  >
                    Abstract
                  </button>
                </div>
              </div>

              {unsplashImages.length > 0 && (
                <div className="unsplash-results">
                  <div className="unsplash-grid">
                    {unsplashImages.map((image) => (
                      <div 
                        key={image.id} 
                        className={`unsplash-image-item ${selectedUnsplashImage?.id === image.id ? 'selected' : ''}`}
                        onClick={() => setSelectedUnsplashImage(image)}
                      >
                        <img 
                          src={image.urls.small} 
                          alt={image.alt_description || image.description || 'Unsplash photo'} 
                        />
                        <div className="image-overlay">
                          <div className="image-info">
                            <span className="photographer">📷 {image.user.name}</span>
                            <span className="image-size">{image.width} × {image.height}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {unsplashImages.length >= 12 && (
                    <div className="load-more-section">
                      <button 
                        className="load-more-btn"
                        onClick={loadMoreUnsplashImages}
                        disabled={isSearchingUnsplash}
                      >
                        {isSearchingUnsplash ? 'Loading...' : 'Load More Images'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedUnsplashImage && (
                <div className="unsplash-preview">
                  <div className="selected-image-preview">
                    <img 
                      src={selectedUnsplashImage.urls.regular} 
                      alt={selectedUnsplashImage.alt_description || 'Selected photo'} 
                    />
                    <div className="image-details">
                      <p className="image-description">
                        {selectedUnsplashImage.description || selectedUnsplashImage.alt_description || 'Beautiful photo'}
                      </p>
                      <p className="photographer-credit">
                        Photo by <strong>{selectedUnsplashImage.user.name}</strong> on Unsplash
                      </p>
                    </div>
                  </div>
                  <div className="unsplash-actions">
                    <button 
                      className="insert-btn"
                      onClick={handleInsertUnsplash}
                    >
                      📄 Insert Image
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => setSelectedUnsplashImage(null)}
                    >
                      Cancel Selection
                    </button>
                  </div>
                </div>
              )}

              {!isSearchingUnsplash && unsplashImages.length === 0 && unsplashQuery && (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <p>No images found for "{unsplashQuery}"</p>
                  <p>Try a different search term or browse popular categories above.</p>
                </div>
              )}

              {!unsplashQuery && unsplashImages.length === 0 && (
                <div className="unsplash-placeholder">
                  <div className="placeholder-icon">📸</div>
                  <h3>Search Unsplash</h3>
                  <p>Find beautiful, free photos from the world's largest photography community</p>
                  <p className="attribution">All photos are provided by <strong>Unsplash</strong> photographers</p>
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