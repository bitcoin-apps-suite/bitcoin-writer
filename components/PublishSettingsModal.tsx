import React, { useState } from 'react';
import { formatUSD } from '../utils/pricingCalculator';

export interface PublishSettings {
  visibility: 'public' | 'encrypted' | 'paywall';
  paywallPrice?: number; // in USD
  description?: string;
  allowComments?: boolean;
  allowSharing?: boolean;
}

interface PublishSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: PublishSettings) => void;
  currentSettings?: PublishSettings;
  documentTitle?: string;
}

const PublishSettingsModal: React.FC<PublishSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentSettings,
  documentTitle
}) => {
  const [visibility, setVisibility] = useState<'public' | 'encrypted' | 'paywall'>(
    currentSettings?.visibility || 'encrypted'
  );
  const [paywallPrice, setPaywallPrice] = useState<string>(
    currentSettings?.paywallPrice?.toString() || '0.99'
  );
  const [description, setDescription] = useState(currentSettings?.description || '');
  const [allowComments, setAllowComments] = useState(currentSettings?.allowComments ?? true);
  const [allowSharing, setAllowSharing] = useState(currentSettings?.allowSharing ?? true);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const settings: PublishSettings = {
      visibility,
      paywallPrice: visibility === 'paywall' ? parseFloat(paywallPrice) : undefined,
      description: description || undefined,
      allowComments,
      allowSharing
    };
    onConfirm(settings);
    onClose();
  };

  const estimatedEarnings = (price: number) => {
    const afterFees = price * 0.95; // 5% platform fee
    return afterFees;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="publish-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Publish Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {documentTitle && (
            <div className="document-info">
              <span className="label">Document:</span>
              <span className="title">{documentTitle}</span>
            </div>
          )}

          <div className="visibility-section">
            <h3>Visibility</h3>
            <div className="visibility-options">
              <label className={`visibility-option ${visibility === 'public' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={(e) => setVisibility(e.target.value as 'public')}
                />
                <div className="option-content">
                  <span className="option-icon">🌍</span>
                  <div>
                    <h4>Public</h4>
                    <p>Anyone can read your document for free</p>
                  </div>
                </div>
              </label>

              <label className={`visibility-option ${visibility === 'encrypted' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="visibility"
                  value="encrypted"
                  checked={visibility === 'encrypted'}
                  onChange={(e) => setVisibility(e.target.value as 'encrypted')}
                />
                <div className="option-content">
                  <span className="option-icon">🔒</span>
                  <div>
                    <h4>Private (Encrypted)</h4>
                    <p>Only you can read this document</p>
                  </div>
                </div>
              </label>

              <label className={`visibility-option ${visibility === 'paywall' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="visibility"
                  value="paywall"
                  checked={visibility === 'paywall'}
                  onChange={(e) => setVisibility(e.target.value as 'paywall')}
                />
                <div className="option-content">
                  <span className="option-icon">💰</span>
                  <div>
                    <h4>Paywall</h4>
                    <p>Readers pay to unlock and read</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {visibility === 'paywall' && (
            <div className="paywall-settings">
              <h3>Paywall Settings</h3>
              <div className="form-group">
                <label htmlFor="price">Price (USD)</label>
                <div className="price-input-group">
                  <span className="currency">$</span>
                  <input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={paywallPrice}
                    onChange={(e) => setPaywallPrice(e.target.value)}
                    className="price-input"
                  />
                </div>
                <div className="earnings-estimate">
                  You'll earn approximately <strong>{formatUSD(estimatedEarnings(parseFloat(paywallPrice)))}</strong> per reader
                  <span className="fee-note">(after 5% platform fee)</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Preview Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give readers a preview of what they'll get..."
                  maxLength={500}
                  rows={3}
                />
                <div className="char-count">{description.length}/500</div>
              </div>
            </div>
          )}

          {visibility !== 'encrypted' && (
            <div className="additional-settings">
              <h3>Additional Settings</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                />
                <span>Allow comments</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={allowSharing}
                  onChange={(e) => setAllowSharing(e.target.checked)}
                />
                <span>Allow sharing</span>
              </label>
            </div>
          )}

          <div className="info-box">
            <span className="info-icon">ℹ️</span>
            <div>
              <strong>Note:</strong> You can change these settings at any time. 
              {visibility === 'encrypted' && ' You can make your document public or add a paywall later.'}
              {visibility === 'public' && ' You can make your document private or add a paywall later.'}
              {visibility === 'paywall' && ' You can change the price or make it free/private later.'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-btn" onClick={handleConfirm}>
            {currentSettings ? 'Update Settings' : 'Confirm Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSettingsModal;