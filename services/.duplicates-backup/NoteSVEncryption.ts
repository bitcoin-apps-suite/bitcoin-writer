/**
 * NoteSV-Style Encryption Service
 * Simple, secure encryption for BSV blockchain storage
 * Based on proven patterns from NOTE.SV password manager
 */

import CryptoJS from 'crypto-js';

export interface NoteSVEncryptionResult {
  encryptedContent: string;
  encryptionMethod: 'NoteSV-AES256';
  salt: string;
  iv: string;
  iterations: number;
  hmac: string; // For integrity verification
}

export class NoteSVEncryption {
  // NoteSV standard parameters
  private static readonly KEY_SIZE = 256 / 32; // 256-bit key
  private static readonly ITERATIONS = 10000; // PBKDF2 iterations (balanced for performance)
  private static readonly SALT_SIZE = 128 / 8; // 128-bit salt
  private static readonly IV_SIZE = 128 / 8; // 128-bit IV
  
  /**
   * Encrypt content using NoteSV methodology
   * Simple, secure, and optimized for BSV storage
   */
  static encrypt(content: string, password: string): NoteSVEncryptionResult {
    // Generate cryptographically secure random salt and IV
    const salt = CryptoJS.lib.WordArray.random(this.SALT_SIZE);
    const iv = CryptoJS.lib.WordArray.random(this.IV_SIZE);
    
    // Derive key from password using PBKDF2
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: this.KEY_SIZE,
      iterations: this.ITERATIONS,
      hasher: CryptoJS.algo.SHA256
    });
    
    // Encrypt content using AES-256-CBC
    const encrypted = CryptoJS.AES.encrypt(content, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Generate HMAC for integrity verification
    const hmacData = salt.toString() + iv.toString() + encrypted.toString();
    const hmac = CryptoJS.HmacSHA256(hmacData, key).toString();
    
    return {
      encryptedContent: encrypted.toString(),
      encryptionMethod: 'NoteSV-AES256',
      salt: salt.toString(),
      iv: iv.toString(),
      iterations: this.ITERATIONS,
      hmac: hmac
    };
  }
  
  /**
   * Decrypt content encrypted with NoteSV methodology
   */
  static decrypt(encryptedData: NoteSVEncryptionResult, password: string): string {
    // Parse hex strings back to WordArrays
    const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
    
    // Derive key from password (must match encryption parameters)
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: this.KEY_SIZE,
      iterations: encryptedData.iterations || this.ITERATIONS,
      hasher: CryptoJS.algo.SHA256
    });
    
    // Verify HMAC integrity
    const hmacData = encryptedData.salt + encryptedData.iv + encryptedData.encryptedContent;
    const calculatedHmac = CryptoJS.HmacSHA256(hmacData, key).toString();
    
    if (calculatedHmac !== encryptedData.hmac) {
      throw new Error('Invalid password or corrupted data (HMAC verification failed)');
    }
    
    // Decrypt content
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encryptedContent, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!plaintext) {
        throw new Error('Invalid password');
      }
      
      return plaintext;
    } catch (error) {
      throw new Error('Decryption failed: Invalid password or corrupted data');
    }
  }
  
  /**
   * Create a BSV-optimized encrypted package
   * Includes all necessary data for on-chain storage
   */
  static createEncryptedPackage(
    content: string, 
    password: string,
    metadata?: {
      title?: string;
      author?: string;
      timestamp?: number;
    }
  ): {
    package: string;
    decryptionInfo: {
      method: string;
      iterations: number;
      requiresPassword: boolean;
    };
  } {
    // Encrypt the content
    const encrypted = this.encrypt(content, password);
    
    // Create package with metadata
    const package_ = {
      version: '1.0',
      encryption: encrypted,
      metadata: {
        ...metadata,
        timestamp: metadata?.timestamp || Date.now(),
        encrypted: true,
        method: 'NoteSV-AES256'
      }
    };
    
    // Convert to compact JSON for BSV storage
    const packageString = JSON.stringify(package_);
    
    return {
      package: packageString,
      decryptionInfo: {
        method: 'NoteSV-AES256',
        iterations: this.ITERATIONS,
        requiresPassword: true
      }
    };
  }
  
  /**
   * Decrypt a BSV-stored encrypted package
   */
  static decryptPackage(packageString: string, password: string): {
    content: string;
    metadata: any;
  } {
    const package_ = JSON.parse(packageString);
    
    if (!package_.encryption) {
      throw new Error('Package is not encrypted');
    }
    
    const decryptedContent = this.decrypt(package_.encryption, password);
    
    return {
      content: decryptedContent,
      metadata: package_.metadata
    };
  }
  
  /**
   * Estimate storage cost for encrypted content
   * Encryption adds overhead: salt (32 chars) + IV (32 chars) + HMAC (64 chars) + base64 encoding (~33% increase)
   */
  static estimateEncryptedSize(originalSize: number): number {
    const encryptionOverhead = 128; // Salt + IV + HMAC in hex
    const base64Overhead = Math.ceil(originalSize * 1.33); // Base64 encoding overhead
    return base64Overhead + encryptionOverhead;
  }
  
  /**
   * Generate a strong password suggestion
   */
  static generateStrongPassword(): string {
    const length = 16;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length];
    }
    
    return password;
  }
  
  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    score: number; // 0-100
    feedback: string;
  } {
    let score = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 10;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    
    // Provide feedback
    if (score < 40) {
      feedback = 'Weak - Add more characters and variety';
    } else if (score < 60) {
      feedback = 'Fair - Consider adding special characters';
    } else if (score < 80) {
      feedback = 'Good - Strong password';
    } else {
      feedback = 'Excellent - Very strong password';
    }
    
    return { score, feedback };
  }
}

// Export for backward compatibility
export default NoteSVEncryption;