/**
 * Metanet Integration for Bitcoin Writer
 * BRC100 compliant implementation for publishing to Metanet App Catalog
 */

import { createAction, encrypt, decrypt, getPublicKey } from '@babbage/wrapped-sdk';

export class MetanetIntegration {
  private appName = 'Bitcoin Writer';
  private appVersion = '2.0.0';
  private appDescription = 'Encrypt, publish and sell shares in your writing on the Bitcoin blockchain';
  private appIcon = '/logo.svg';
  private appUrl = 'https://www.bitcoin-writer.com';
  
  /**
   * Initialize BRC100 wallet connection
   */
  async initializeWallet() {
    try {
      // Get the user's public key to verify wallet connection
      const publicKey = await getPublicKey({
        protocolID: [0, 'Bitcoin Writer'],
        keyID: 'identity'
      });
      
      console.log('✅ BRC100 wallet connected:', publicKey);
      return { success: true, publicKey };
    } catch (error) {
      console.error('Failed to initialize BRC100 wallet:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Save document to blockchain using BRC100 standard
   */
  async saveToBlockchain(document: {
    title: string;
    content: string;
    metadata?: any;
  }) {
    try {
      // Prepare the document data
      const documentData = {
        title: document.title,
        content: document.content,
        metadata: {
          ...document.metadata,
          app: this.appName,
          version: this.appVersion,
          timestamp: new Date().toISOString()
        }
      };
      
      // Create a blockchain action (transaction)
      const result = await createAction({
        description: `Save document: ${document.title}`,
        outputs: [{
          script: this.buildDocumentScript(documentData),
          satoshis: 1000, // Minimal dust amount
          description: 'Document storage on blockchain'
        }]
      });
      
      console.log('Document saved to blockchain:', result);
      return { success: true, txid: result.txid, rawTx: result.rawTx };
    } catch (error) {
      console.error('Failed to save to blockchain:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Encrypt document for secure storage
   */
  async encryptDocument(content: string, keyID: string = 'document') {
    try {
      const encrypted = await encrypt({
        plaintext: Buffer.from(content),
        protocolID: [0, 'Bitcoin Writer Documents'],
        keyID
      });
      
      return { success: true, encrypted };
    } catch (error) {
      console.error('Failed to encrypt document:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Decrypt document
   */
  async decryptDocument(ciphertext: string, keyID: string = 'document') {
    try {
      const decrypted = await decrypt({
        ciphertext,
        protocolID: [0, 'Bitcoin Writer Documents'],
        keyID,
        returnType: 'string'
      });
      
      return { success: true, decrypted };
    } catch (error) {
      console.error('Failed to decrypt document:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Build OP_RETURN script for document storage
   */
  private buildDocumentScript(data: any): string {
    // Convert data to JSON and then to hex
    const jsonStr = JSON.stringify(data);
    const hex = Buffer.from(jsonStr).toString('hex');
    
    // Build OP_RETURN script
    // 6a is OP_RETURN, followed by push data
    return `6a${this.buildPushData(hex)}`;
  }
  
  /**
   * Build push data opcode
   */
  private buildPushData(hex: string): string {
    const len = hex.length / 2;
    
    if (len <= 75) {
      // Direct push
      return len.toString(16).padStart(2, '0') + hex;
    } else if (len <= 255) {
      // OP_PUSHDATA1
      return '4c' + len.toString(16).padStart(2, '0') + hex;
    } else if (len <= 65535) {
      // OP_PUSHDATA2
      const lenHex = len.toString(16).padStart(4, '0');
      const lenLE = lenHex.slice(2, 4) + lenHex.slice(0, 2); // Little endian
      return '4d' + lenLE + hex;
    } else {
      throw new Error('Data too large for OP_RETURN');
    }
  }
  
  /**
   * Register app with Metanet Overlay
   */
  async registerApp() {
    try {
      // Create the app registration transaction for Metanet
      const appData = {
        name: this.appName,
        version: this.appVersion,
        description: this.appDescription,
        icon: this.appIcon,
        url: this.appUrl,
        type: 'writing',
        protocol: 'BRC100',
        capabilities: [
          'document-creation',
          'encryption',
          'blockchain-storage',
          'tokenization',
          'file-shares'
        ]
      };
      
      const result = await createAction({
        description: 'Register Bitcoin Writer on Metanet',
        outputs: [{
          script: this.buildAppRegistrationScript(appData),
          satoshis: 1000,
          description: 'Metanet App Registration'
        }]
      });
      
      console.log('App registered on Metanet:', result);
      return { success: true, txid: result.txid };
    } catch (error) {
      console.error('Failed to register app:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Build Metanet app registration script
   */
  private buildAppRegistrationScript(data: any): string {
    // Add Metanet protocol prefix
    const metanetData = {
      ...data,
      metanet: {
        protocol: 'app-registration',
        version: '1.0'
      }
    };
    
    const jsonStr = JSON.stringify(metanetData);
    const hex = Buffer.from(jsonStr).toString('hex');
    
    return `6a${this.buildPushData(hex)}`;
  }
}

// Export singleton instance
export const metanetIntegration = new MetanetIntegration();