import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class SignatureService {
  private privKey: string;
  private pubKey: string;
  private studio21PubKey: string;

  constructor() {
    // Try to load keys, but don't throw an error if they don't exist (for testing purposes)
    try {
      let privPemPath, pubPemPath, studio21PubKeyPath;
      
      // Look for keys in multiple possible locations
      const possiblePaths = [
        // Current directory
        path.resolve('.', 'ec.key'),
        path.resolve('.', 'ec.pub'),
        path.resolve('.', 'studio21-pub.key'),
        // When running from dist/src
        path.resolve(__dirname, '..', '..', '..', 'ec.key'),
        path.resolve(__dirname, '..', '..', '..', 'ec.pub'),
        path.resolve(__dirname, '..', '..', '..', 'studio21-pub.key'),
        // When running from dist
        path.resolve(__dirname, '..', '..', 'ec.key'),
        path.resolve(__dirname, '..', '..', 'ec.pub'),
        path.resolve(__dirname, '..', '..', 'studio21-pub.key'),
        // When running from src
        path.resolve(__dirname, '..', '..', '..', '..', 'ec.key'),
        path.resolve(__dirname, '..', '..', '..', '..', 'ec.pub'),
        path.resolve(__dirname, '..', '..', '..', '..', 'studio21-pub.key'),
      ];
      
      console.log('Studio21 Signature Service - Searching for keys in possible locations:');
      possiblePaths.forEach((p, i) => {
        if (i % 3 === 0) console.log(`  Checking: ${path.dirname(p)}`);
        console.log(`    ${fs.existsSync(p) ? '✓' : '✗'} ${path.basename(p)}: ${p}`);
      });
      
      // Try to find the keys in any of the possible locations
      for (let i = 0; i < possiblePaths.length; i += 3) {
        const privPath = possiblePaths[i];
        const pubPath = possiblePaths[i + 1];
        const studio21Path = possiblePaths[i + 2];
        
        if (fs.existsSync(privPath) && fs.existsSync(pubPath)) {
          privPemPath = privPath;
          pubPemPath = pubPath;
          studio21PubKeyPath = studio21Path;
          console.log(`Studio21 Signature Service - Found keys at: ${path.dirname(privPath)}`);
          break;
        }
      }
      
      if (privPemPath && pubPemPath) {
        this.privKey = fs.readFileSync(privPemPath, 'utf8');
        this.pubKey = fs.readFileSync(pubPemPath, 'utf8');
        console.log('Studio21 Signature Service - Operator signature keys loaded successfully from:', privPemPath);
      } else {
        console.warn('Studio21 Signature Service - Operator signature keys not found.');
        console.log('Current directory:', process.cwd());
        console.log('Files in current directory:', fs.readdirSync('.'));
        
        // Try to find the keys by searching up the directory tree
        let currentDir = __dirname;
        let attempts = 0;
        const maxAttempts = 10;
        while (currentDir !== path.resolve(currentDir, '..') && attempts < maxAttempts) {
          const testPrivPath = path.join(currentDir, 'ec.key');
          const testPubPath = path.join(currentDir, 'ec.pub');
          const testStudio21Path = path.join(currentDir, 'studio21-pub.key');
          
          if (fs.existsSync(testPrivPath) && fs.existsSync(testPubPath)) {
            privPemPath = testPrivPath;
            pubPemPath = testPubPath;
            studio21PubKeyPath = testStudio21Path;
            this.privKey = fs.readFileSync(privPemPath, 'utf8');
            this.pubKey = fs.readFileSync(pubPemPath, 'utf8');
            console.log('Studio21 Signature Service - Operator signature keys loaded successfully from:', privPemPath);
            break;
          }
          
          currentDir = path.resolve(currentDir, '..');
          attempts++;
        }
      }
      
      if (studio21PubKeyPath && fs.existsSync(studio21PubKeyPath)) {
        this.studio21PubKey = fs.readFileSync(studio21PubKeyPath, 'utf8');
        console.log('Studio21 Signature Service - Studio21 public key loaded successfully from:', studio21PubKeyPath);
      } else if (studio21PubKeyPath) {
        // Try to find the Studio21 key by searching up the directory tree
        let currentDir = __dirname;
        let attempts = 0;
        const maxAttempts = 10;
        while (currentDir !== path.resolve(currentDir, '..') && attempts < maxAttempts) {
          const testStudio21Path = path.join(currentDir, 'studio21-pub.key');
          
          if (fs.existsSync(testStudio21Path)) {
            studio21PubKeyPath = testStudio21Path;
            this.studio21PubKey = fs.readFileSync(studio21PubKeyPath, 'utf8');
            console.log('Studio21 Signature Service - Studio21 public key loaded successfully from:', studio21PubKeyPath);
            break;
          }
          
          currentDir = path.resolve(currentDir, '..');
          attempts++;
        }
      } else {
        console.warn('Studio21 Signature Service - Studio21 public key not found.');
      }
      
      console.log('Studio21 Signature Service - Keys loaded:', {
        privKey: !!this.privKey,
        pubKey: !!this.pubKey,
        studio21PubKey: !!this.studio21PubKey
      });
    } catch (error) {
      console.warn('Studio21 Signature Service - Error loading signature keys:', error.message);
      console.log('Current directory:', process.cwd());
      console.log('Files in current directory:', fs.readdirSync('.'));
    }
  }

  /**
   * @description This function is used to create signature for Studio 21 API.
   * @param data The data to sign
   * @returns base64 encoded signature
   */
  async createSignature(data: string): Promise<string> {
    console.log('Studio21 Signature Service - Creating signature, private key loaded:', !!this.privKey);
    
    if (!this.privKey) {
      throw new Error('Private key not loaded. Cannot create signature.');
    }
    
    try {
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(data);
      const signature = signer.sign(this.privKey, 'base64');
      console.log('Studio21 Signature Service - Signature created successfully');
      return signature;
    } catch (error) {
      console.error('Error creating signature:', error);
      throw new Error('Failed to create signature: ' + error.message);
    }
  }

  /**
   * @description This function is used to verify signature of Studio 21 API.
   * @param signature The base64 encoded signature to verify
   * @param data The data that was signed
   * @returns boolean indicating if signature is valid
   */
  async verifySignature(signature: string, data: string): Promise<boolean> {
    if (!this.pubKey && !this.studio21PubKey) {
      throw new Error('No public key loaded. Cannot verify signature.');
    }
    
    try {
      // Try to verify with Studio 21's public key first (for Wallet API requests)
      if (this.studio21PubKey) {
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(data, 'utf8');
        const isValid = verify.verify(this.studio21PubKey, signature, 'base64');
        if (isValid) return true;
      }
      
      // If that fails, try with operator's public key (for Games API responses)
      if (this.pubKey) {
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(data, 'utf8');
        const isValid = verify.verify(this.pubKey, signature, 'base64');
        return isValid;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying signature:', error);
      throw new Error('Failed to verify signature');
    }
  }
  
  /**
   * @description Load keys from specific paths (useful for testing)
   * @param privKeyPath Path to private key
   * @param pubKeyPath Path to public key
   */
  loadKeysFromPaths(privKeyPath: string, pubKeyPath: string): void {
    try {
      this.privKey = fs.readFileSync(privKeyPath, 'utf8');
      this.pubKey = fs.readFileSync(pubKeyPath, 'utf8');
    } catch (error) {
      console.error('Error loading keys from paths:', error);
      throw new Error('Failed to load keys from paths');
    }
  }
  
  /**
   * @description Load keys directly from strings (useful for testing)
   * @param privKey Private key content
   * @param pubKey Public key content
   */
  loadKeysFromStrings(privKey: string, pubKey: string): void {
    this.privKey = privKey;
    this.pubKey = pubKey;
  }
  
  /**
   * @description Load Studio 21 public key from string
   * @param pubKey Studio 21 public key content
   */
  loadStudio21PubKeyFromString(pubKey: string): void {
    this.studio21PubKey = pubKey;
  }
  
  /**
   * @description Check if keys are loaded
   * @returns Object with key status
   */
  getKeyStatus(): { privKey: boolean; pubKey: boolean; studio21PubKey: boolean } {
    return {
      privKey: !!this.privKey,
      pubKey: !!this.pubKey,
      studio21PubKey: !!this.studio21PubKey,
    };
  }
}