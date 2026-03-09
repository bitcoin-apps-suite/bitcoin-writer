/**
 * Signature-Based Encryption Service
 * Uses BSV signatures to encrypt/decrypt content without passwords
 * Much more user-friendly than password-based encryption
 */

import CryptoJS from 'crypto-js';

export interface SignatureEncryptionResult {
  encryptedContent: string;
  encryptionMethod: 'BSV-Signature-AES256';
  keyDerivationData: string; // Data needed to recreate the key from signature
  iv: string;
  hmac: string;
  publicKey?: string; // For verification
}

export class SignatureEncryption {
  private static readonly KEY_SIZE = 256 / 32; // 256-bit key
  private static readonly IV_SIZE = 128 / 8; // 128-bit IV
  
  /**
   * Encrypt content using a BSV signature as the encryption key
   * No password required - just sign a message!
   */
  static async encryptWithSignature(
    content: string,
    message: string = 'Encrypt document for blockchain storage',
    signFunction: (message: string) => Promise<{signature: string, publicKey: string}>
  ): Promise<SignatureEncryptionResult> {
    
    // Get signature from user's wallet
    const { signature, publicKey } = await signFunction(message);
    
    // Derive encryption key from signature
    const encryptionKey = this.deriveKeyFromSignature(signature, message);
    
    // Generate IV for this encryption
    const iv = CryptoJS.lib.WordArray.random(this.IV_SIZE);
    
    // Encrypt content
    const encrypted = CryptoJS.AES.encrypt(content, encryptionKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Generate HMAC for integrity
    const hmacData = message + iv.toString() + encrypted.toString();
    const hmac = CryptoJS.HmacSHA256(hmacData, encryptionKey).toString();
    
    return {
      encryptedContent: encrypted.toString(),
      encryptionMethod: 'BSV-Signature-AES256',
      keyDerivationData: message, // Store the message that was signed
      iv: iv.toString(),
      hmac: hmac,
      publicKey: publicKey
    };
  }
  
  /**
   * Decrypt content by signing the same message again
   */
  static async decryptWithSignature(
    encryptedData: SignatureEncryptionResult,
    signFunction: (message: string) => Promise<{signature: string, publicKey: string}>
  ): Promise<string> {
    
    // Sign the same message that was used for encryption
    const { signature, publicKey } = await signFunction(encryptedData.keyDerivationData);
    
    // Verify public key matches (optional security check)
    if (encryptedData.publicKey && encryptedData.publicKey !== publicKey) {
      throw new Error('Public key mismatch - this document was encrypted by a different key');
    }
    
    // Derive the same encryption key
    const encryptionKey = this.deriveKeyFromSignature(signature, encryptedData.keyDerivationData);
    
    // Parse IV
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
    
    // Verify HMAC integrity
    const hmacData = encryptedData.keyDerivationData + encryptedData.iv + encryptedData.encryptedContent;
    const calculatedHmac = CryptoJS.HmacSHA256(hmacData, encryptionKey).toString();
    
    if (calculatedHmac !== encryptedData.hmac) {
      throw new Error('Invalid signature or corrupted data');
    }
    
    // Decrypt content
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encryptedContent, encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!plaintext) {
        throw new Error('Invalid signature');
      }
      
      return plaintext;
    } catch (error) {
      throw new Error('Decryption failed: Invalid signature or corrupted data');
    }
  }
  
  /**
   * Derive a consistent encryption key from a BSV signature
   */
  private static deriveKeyFromSignature(signature: string, message: string): CryptoJS.lib.WordArray {
    // Combine signature with message for key derivation
    const keyMaterial = signature + '|' + message;
    
    // Use PBKDF2 with the signature as both password and salt for deterministic key generation
    const key = CryptoJS.PBKDF2(keyMaterial, CryptoJS.SHA256(keyMaterial), {
      keySize: this.KEY_SIZE,
      iterations: 1000, // Lower iterations since signature entropy is already high
      hasher: CryptoJS.algo.SHA256
    });
    
    return key;
  }
  
  /**
   * Create a simplified encrypted package for blockchain storage
   */
  static async createEncryptedPackage(
    content: string,
    signFunction: (message: string) => Promise<{signature: string, publicKey: string}>,
    metadata?: {
      title?: string;
      author?: string;
      timestamp?: number;
    }
  ): Promise<{
    package: string;
    decryptionInfo: {
      method: string;
      requiresSignature: boolean;
      publicKey: string;
    };
  }> {
    
    // Create a unique message for this document
    const message = `Encrypt document: ${metadata?.title || 'Untitled'} - ${Date.now()}`;
    
    // Encrypt the content
    const encrypted = await this.encryptWithSignature(content, message, signFunction);
    
    // Create compact package
    const package_ = {
      v: '1.0', // version
      e: encrypted, // encryption data
      m: { // metadata
        ...metadata,
        timestamp: metadata?.timestamp || Date.now(),
        encrypted: true,
        method: 'BSV-Signature-AES256'
      }
    };
    
    return {
      package: JSON.stringify(package_),
      decryptionInfo: {
        method: 'BSV-Signature-AES256',
        requiresSignature: true,
        publicKey: encrypted.publicKey || ''
      }
    };
  }
  
  /**
   * Decrypt a package from blockchain storage
   */
  static async decryptPackage(
    packageString: string,
    signFunction: (message: string) => Promise<{signature: string, publicKey: string}>
  ): Promise<{
    content: string;
    metadata: any;
  }> {
    const package_ = JSON.parse(packageString);
    
    if (!package_.e) {
      throw new Error('Package is not encrypted');
    }
    
    const decryptedContent = await this.decryptWithSignature(package_.e, signFunction);
    
    return {
      content: decryptedContent,
      metadata: package_.m
    };
  }
  
  /**
   * Check if the current user can decrypt this package
   */
  static canDecrypt(packageString: string, currentPublicKey: string): boolean {
    try {
      const package_ = JSON.parse(packageString);
      return package_.e?.publicKey === currentPublicKey;
    } catch {
      return false;
    }
  }
}

export default SignatureEncryption;