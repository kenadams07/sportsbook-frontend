import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class SignatureService {
  private privKey: string;
  private pubKey: string;

  constructor() {
    // Try to load keys, but don't throw an error if they don't exist (for testing purposes)
    try {
      const privPemPath = path.resolve(__dirname, '../../../..', 'ec.key');
      const pubPemPath = path.resolve(__dirname, '../../../..', 'ec.pub');
      
      if (fs.existsSync(privPemPath) && fs.existsSync(pubPemPath)) {
        this.privKey = fs.readFileSync(privPemPath, 'utf8');
        this.pubKey = fs.readFileSync(pubPemPath, 'utf8');
      } else {
        console.warn('Signature keys not found. Signature service will not work until keys are provided.');
      }
    } catch (error) {
      console.warn('Error loading signature keys:', error.message);
    }
  }

  /**
   * @description This function is used to create signature for st8.
   * @param data The data to sign
   * @returns base64 encoded signature
   */
  async createSignature(data: string): Promise<string> {
    if (!this.privKey) {
      throw new Error('Private key not loaded. Cannot create signature.');
    }
    
    try {
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(data);
      const signature = signer.sign(this.privKey, 'base64');
      return signature;
    } catch (error) {
      console.error('Error creating signature:', error);
      throw new Error('Failed to create signature');
    }
  }

  /**
   * @description This function is used to verify signature of st8.
   * @param signature The base64 encoded signature to verify
   * @param data The data that was signed
   * @returns boolean indicating if signature is valid
   */
  async verifySignature(signature: string, data: string): Promise<boolean> {
    if (!this.pubKey) {
      throw new Error('Public key not loaded. Cannot verify signature.');
    }
    
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(data, 'utf8');
      const isValid = verify.verify(this.pubKey, signature, 'base64');
      return isValid;
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
}