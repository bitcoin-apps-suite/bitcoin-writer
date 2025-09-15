import CryptoJS from 'crypto-js';

export interface EncryptionResult {
  encryptedData: string;
  encryptionKey?: string;
  iv?: string;
  salt?: string;
  unlockConditions?: any;
}

export interface DecryptionParams {
  encryptedData: string;
  password?: string;
  encryptionKey?: string;
  iv?: string;
  salt?: string;
}

export class EncryptionService {
  
  /**
   * Encrypt content with password
   */
  static encryptWithPassword(content: string, password: string): EncryptionResult {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    
    const encrypted = CryptoJS.AES.encrypt(content, key, { 
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return {
      encryptedData: encrypted.toString(),
      salt: salt.toString(),
      iv: iv.toString()
    };
  }
  
  /**
   * Decrypt content with password
   */
  static decryptWithPassword(params: DecryptionParams): string {
    if (!params.password || !params.salt || !params.iv) {
      throw new Error('Password, salt, and IV required for decryption');
    }
    
    const salt = CryptoJS.enc.Hex.parse(params.salt);
    const iv = CryptoJS.enc.Hex.parse(params.iv);
    const key = CryptoJS.PBKDF2(params.password, salt, {
      keySize: 256 / 32,
      iterations: 1000
    });
    
    const decrypted = CryptoJS.AES.decrypt(params.encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  
  /**
   * Time-lock encryption
   * Creates an encryption that can only be decrypted after a specific time
   */
  static encryptWithTimelock(content: string, unlockTime: Date): EncryptionResult {
    // Generate a time-based key that will be revealed at unlock time
    const timeSeed = Math.floor(unlockTime.getTime() / 1000);
    const timeKey = CryptoJS.SHA256(timeSeed.toString()).toString();
    
    // For now, we'll use a simple approach - in production, this would use
    // a time-lock puzzle or connect to a timelock server
    const encrypted = CryptoJS.AES.encrypt(content, timeKey);
    
    return {
      encryptedData: encrypted.toString(),
      unlockConditions: {
        type: 'timelock',
        unlockTime: unlockTime.toISOString(),
        timeSeed
      }
    };
  }
  
  /**
   * Decrypt time-locked content
   */
  static decryptTimelock(encryptedData: string, unlockTime: Date): string {
    const currentTime = new Date();
    if (currentTime < unlockTime) {
      const timeRemaining = Math.ceil((unlockTime.getTime() - currentTime.getTime()) / 1000);
      throw new Error(`Content is time-locked. Unlocks in ${timeRemaining} seconds`);
    }
    
    const timeSeed = Math.floor(unlockTime.getTime() / 1000);
    const timeKey = CryptoJS.SHA256(timeSeed.toString()).toString();
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, timeKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  
  /**
   * Multi-party encryption (simplified version)
   * In production, this would use Shamir's Secret Sharing or similar
   */
  static encryptMultiparty(content: string, requiredKeys: number = 2): EncryptionResult {
    // Generate master key
    const masterKey = CryptoJS.lib.WordArray.random(256 / 8).toString();
    
    // Encrypt content with master key
    const encrypted = CryptoJS.AES.encrypt(content, masterKey);
    
    // Split the master key into shares (simplified)
    const keyShares = [];
    for (let i = 0; i < requiredKeys; i++) {
      const share = CryptoJS.lib.WordArray.random(256 / 8).toString();
      keyShares.push(share);
    }
    
    // XOR all shares to create the master key recovery data
    // In production, use proper secret sharing scheme
    const recoveryData = keyShares.reduce((acc, share) => {
      return this.xorStrings(acc, share);
    }, masterKey);
    
    return {
      encryptedData: encrypted.toString(),
      unlockConditions: {
        type: 'multiparty',
        requiredKeys,
        recoveryData,
        keyShares // In production, these would be distributed separately
      }
    };
  }
  
  /**
   * Helper function to XOR two hex strings
   */
  private static xorStrings(str1: string, str2: string): string {
    const buf1 = CryptoJS.enc.Hex.parse(str1);
    const buf2 = CryptoJS.enc.Hex.parse(str2);
    
    const result = CryptoJS.lib.WordArray.create();
    for (let i = 0; i < buf1.words.length; i++) {
      result.words[i] = buf1.words[i] ^ (buf2.words[i] || 0);
    }
    result.sigBytes = buf1.sigBytes;
    
    return result.toString(CryptoJS.enc.Hex);
  }
  
  /**
   * Generate encryption key from user data
   */
  static generateUserKey(handle: string, accessToken: string): string {
    const keyData = `${handle}_${accessToken.substring(0, 32)}`;
    return CryptoJS.SHA256(keyData).toString();
  }
  
  /**
   * Create a shareable unlock link
   */
  static createUnlockLink(documentId: string, encryptionKey?: string): string {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      doc: documentId,
      ...(encryptionKey ? { key: encryptionKey } : {})
    });
    
    return `${baseUrl}/unlock?${params.toString()}`;
  }
  
  /**
   * Verify if content can be unlocked based on conditions
   */
  static canUnlock(unlockConditions: any): { canUnlock: boolean; reason?: string } {
    if (!unlockConditions) {
      return { canUnlock: true };
    }
    
    switch (unlockConditions.type) {
      case 'timelock':
        const unlockTime = new Date(unlockConditions.unlockTime);
        const now = new Date();
        if (now < unlockTime) {
          const timeRemaining = Math.ceil((unlockTime.getTime() - now.getTime()) / 1000);
          const hours = Math.floor(timeRemaining / 3600);
          const minutes = Math.floor((timeRemaining % 3600) / 60);
          const seconds = timeRemaining % 60;
          
          let timeString = '';
          if (hours > 0) timeString += `${hours}h `;
          if (minutes > 0) timeString += `${minutes}m `;
          timeString += `${seconds}s`;
          
          return { 
            canUnlock: false, 
            reason: `Content unlocks in ${timeString}` 
          };
        }
        return { canUnlock: true };
        
      case 'priced':
        if (!unlockConditions.paid) {
          return { 
            canUnlock: false, 
            reason: `Payment of $${unlockConditions.price} required` 
          };
        }
        return { canUnlock: true };
        
      case 'multiparty':
        const providedKeys = unlockConditions.providedKeys || 0;
        if (providedKeys < unlockConditions.requiredKeys) {
          return { 
            canUnlock: false, 
            reason: `${providedKeys}/${unlockConditions.requiredKeys} keys provided` 
          };
        }
        return { canUnlock: true };
        
      default:
        return { canUnlock: true };
    }
  }
}