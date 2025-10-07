import { Test, TestingModule } from '@nestjs/testing';
import { SignatureService } from './signature.service';
import * as fs from 'fs';
import * as path from 'path';

describe('SignatureService', () => {
  let service: SignatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignatureService],
    }).compile();

    service = module.get<SignatureService>(SignatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Only run these tests if key files exist
  if (fs.existsSync(path.resolve(__dirname, '../../../..', 'ec.key')) && 
      fs.existsSync(path.resolve(__dirname, '../../../..', 'ec.pub'))) {
    
    it('should create and verify a signature', async () => {
      const testData = 'test data for signing';
      
      // Create a signature
      const signature = await service.createSignature(testData);
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      
      // Verify the signature
      const isValid = await service.verifySignature(signature, testData);
      expect(isValid).toBe(true);
    });

    it('should return false for invalid signature', async () => {
      const testData = 'test data for signing';
      const wrongData = 'wrong data';
      
      // Create a signature
      const signature = await service.createSignature(testData);
      
      // Verify with wrong data should return false
      const isValid = await service.verifySignature(signature, wrongData);
      expect(isValid).toBe(false);
    });
  } else {
    // If keys don't exist, test the key loading methods
    it('should load keys from strings', async () => {
      // Generate test keys for testing
      const { publicKey, privateKey } = require('crypto').generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });
      
      service.loadKeysFromStrings(privateKey, publicKey);
      
      const testData = 'test data for signing';
      
      // Create a signature
      const signature = await service.createSignature(testData);
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      
      // Verify the signature
      const isValid = await service.verifySignature(signature, testData);
      expect(isValid).toBe(true);
    });
  }
});