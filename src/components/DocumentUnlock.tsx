import React, { useState, useEffect } from 'react';
import { EncryptionService } from '../utils/encryptionUtils';
import BSVStorageService from '../services/BSVStorageService';
import './DocumentUnlock.css';

interface DocumentUnlockProps {
  transactionId: string;
  unlockConditions?: any;
  onUnlock: (content: string) => void;
  handcashService?: any;
}

const DocumentUnlock: React.FC<DocumentUnlockProps> = ({
  transactionId,
  unlockConditions,
  onUnlock,
  handcashService
}) => {
  const [unlockStatus, setUnlockStatus] = useState<'checking' | 'locked' | 'unlocked'>('checking');
  const [unlockReason, setUnlockReason] = useState<string>('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [document, setDocument] = useState<any>(null);
  
  const bsvService = new BSVStorageService();

  useEffect(() => {
    checkUnlockStatus();
    const interval = setInterval(checkUnlockStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkUnlockStatus = async () => {
    if (!unlockConditions) {
      setUnlockStatus('unlocked');
      return;
    }

    const { canUnlock, reason } = EncryptionService.canUnlock(unlockConditions);
    
    if (canUnlock) {
      setUnlockStatus('unlocked');
      if (unlockConditions.type === 'timelock') {
        await attemptTimelockUnlock();
      }
    } else {
      setUnlockStatus('locked');
      setUnlockReason(reason || '');
      
      // Update time remaining for time-locked content
      if (unlockConditions.type === 'timelock' || 
          unlockConditions.method === 'timed' || 
          unlockConditions.method === 'timedAndPriced') {
        updateTimeRemaining();
      }
    }
  };

  const updateTimeRemaining = () => {
    if (!unlockConditions.unlockTime) return;
    
    const unlockTime = new Date(unlockConditions.unlockTime);
    const now = new Date();
    const diff = unlockTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      setTimeRemaining('Unlocking...');
      checkUnlockStatus();
      return;
    }
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    let timeStr = '';
    if (hours > 0) timeStr += `${hours}h `;
    if (minutes > 0) timeStr += `${minutes}m `;
    timeStr += `${seconds}s`;
    
    setTimeRemaining(timeStr);
  };

  const attemptTimelockUnlock = async () => {
    try {
      setIsProcessing(true);
      
      // Retrieve document from blockchain
      const doc = await bsvService.retrieveDocument(transactionId);
      if (!doc) {
        throw new Error('Document not found');
      }
      
      setDocument(doc);
      
      // If it's time-locked and time has passed, decrypt
      if (doc.encryptionData?.method === 'timelock') {
        const unlockTime = new Date(doc.encryptionData.unlockConditions.unlockTime);
        const decrypted = EncryptionService.decryptTimelock(doc.content, unlockTime);
        onUnlock(decrypted);
      } else {
        onUnlock(doc.content);
      }
      
      setUnlockStatus('unlocked');
    } catch (error) {
      console.error('Failed to unlock:', error);
      setUnlockReason('Failed to decrypt document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasswordUnlock = async () => {
    if (!password) {
      alert('Please enter a password');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Retrieve document from blockchain
      const doc = await bsvService.retrieveDocument(transactionId);
      if (!doc) {
        throw new Error('Document not found');
      }
      
      setDocument(doc);
      
      // Decrypt with password
      if (doc.encryptionData) {
        const decrypted = EncryptionService.decryptWithPassword({
          encryptedData: doc.content,
          password,
          salt: doc.encryptionData.salt,
          iv: doc.encryptionData.iv
        });
        
        onUnlock(decrypted);
        setUnlockStatus('unlocked');
      }
    } catch (error) {
      console.error('Failed to unlock:', error);
      alert('Invalid password or decryption failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentUnlock = async () => {
    if (!handcashService) {
      alert('Please connect HandCash wallet to make payment');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const price = unlockConditions.unlockPrice || 
                    unlockConditions.tieredPricing?.full || 
                    0.01;
      
      // Process payment through HandCash
      const paymentResult = await handcashService.makePayment({
        amount: price,
        currency: 'USD',
        description: `Unlock document: ${transactionId}`,
        destination: document?.author || 'author'
      });
      
      if (paymentResult.success) {
        // Mark as paid in unlock conditions
        unlockConditions.paid = true;
        
        // Retrieve and decrypt document
        const doc = await bsvService.retrieveDocument(transactionId);
        if (doc) {
          let content = doc.content;
          
          // Decrypt if encrypted
          if (doc.encrypted && doc.encryptionData) {
            // For paid content, we'd normally get the decryption key from the payment response
            // For demo, we'll use a simple approach
            content = await decryptPaidContent(doc, paymentResult);
          }
          
          onUnlock(content);
          setUnlockStatus('unlocked');
        }
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const decryptPaidContent = async (doc: any, paymentResult: any) => {
    // In production, the payment would return a decryption key
    // For demo, we'll simulate this
    return doc.content; // Would be decrypted in production
  };

  const renderUnlockInterface = () => {
    if (unlockStatus === 'checking') {
      return <div className="loading">Checking document status...</div>;
    }
    
    if (unlockStatus === 'unlocked') {
      return (
        <div className="unlock-success">
          <div className="success-icon">✓</div>
          <h3>Document Unlocked</h3>
          <p>You now have full access to this document.</p>
        </div>
      );
    }
    
    // Locked - show appropriate unlock interface
    const unlockMethod = unlockConditions?.method || unlockConditions?.type;
    
    switch (unlockMethod) {
      case 'password':
        return (
          <div className="password-unlock">
            <h3>Password Protected</h3>
            <p>This document requires a password to unlock.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isProcessing}
            />
            <button 
              onClick={handlePasswordUnlock}
              disabled={isProcessing}
            >
              {isProcessing ? 'Unlocking...' : 'Unlock'}
            </button>
          </div>
        );
        
      case 'timed':
      case 'timelock':
        return (
          <div className="timed-unlock">
            <h3>Time-Locked Document</h3>
            <p>This document will automatically unlock in:</p>
            <div className="countdown">{timeRemaining}</div>
            <small>Unlock time: {new Date(unlockConditions.unlockTime).toLocaleString()}</small>
          </div>
        );
        
      case 'priced':
        return (
          <div className="priced-unlock">
            <h3>Premium Content</h3>
            <p>Unlock this document for:</p>
            <div className="price">
              ${unlockConditions.unlockPrice || unlockConditions.tieredPricing?.full || '0.01'}
            </div>
            <button 
              onClick={handlePaymentUnlock}
              disabled={isProcessing || !handcashService}
            >
              {isProcessing ? 'Processing...' : 'Pay & Unlock'}
            </button>
            {!handcashService && (
              <small className="warning">Connect HandCash wallet to make payment</small>
            )}
          </div>
        );
        
      case 'timedAndPriced':
        return (
          <div className="timed-priced-unlock">
            <h3>Early Access Content</h3>
            <div className="unlock-options">
              <div className="option">
                <h4>Pay for Immediate Access</h4>
                <div className="price">
                  ${unlockConditions.unlockPrice || unlockConditions.tieredPricing?.full || '0.01'}
                </div>
                <button 
                  onClick={handlePaymentUnlock}
                  disabled={isProcessing || !handcashService}
                >
                  {isProcessing ? 'Processing...' : 'Pay & Unlock Now'}
                </button>
              </div>
              
              <div className="divider">OR</div>
              
              <div className="option">
                <h4>Wait for Free Access</h4>
                <div className="countdown">{timeRemaining}</div>
                <small>Free after: {new Date(unlockConditions.unlockTime).toLocaleString()}</small>
              </div>
            </div>
          </div>
        );
        
      case 'multiparty':
        return (
          <div className="multiparty-unlock">
            <h3>Multi-Party Encryption</h3>
            <p>This document requires multiple keys to unlock.</p>
            <div className="key-status">
              {unlockConditions.providedKeys || 0} / {unlockConditions.requiredKeys || 2} keys provided
            </div>
            <button disabled>Waiting for additional keys...</button>
          </div>
        );
        
      default:
        return (
          <div className="unknown-unlock">
            <h3>Document Locked</h3>
            <p>{unlockReason || 'This document has restricted access.'}</p>
          </div>
        );
    }
  };

  return (
    <div className="document-unlock">
      {renderUnlockInterface()}
    </div>
  );
};

export default DocumentUnlock;