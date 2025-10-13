/**
 * Simple test script to verify Studio 21 integration setup
 */

import { SignatureService } from './src/utils/signature.service';

async function testSignatureService() {
  console.log('Testing Studio 21 Signature Service...');
  
  try {
    const signatureService = new SignatureService();
    
    // Test data
    const testData = JSON.stringify({
      operatorId: 'test_operator',
      userId: 'test_user',
      token: 'test_token',
      gameId: 'test_game',
      currency: 'USD'
    });
    
    console.log('Test data:', testData);
    
    // Try to create a signature
    try {
      const signature = await signatureService.createSignature(testData);
      console.log('Signature created successfully:', signature);
      
      // Try to verify the signature
      const isValid = await signatureService.verifySignature(signature, testData);
      console.log('Signature verification result:', isValid ? 'VALID' : 'INVALID');
      
      if (isValid) {
        console.log('✅ Signature service is working correctly!');
      } else {
        console.log('❌ Signature verification failed');
      }
    } catch (error) {
      console.log('⚠️  Signature creation failed (keys may not be present):', error.message);
      console.log('This is expected if ec.key and ec.pub files are not in the project root');
    }
  } catch (error) {
    console.error('Error testing signature service:', error);
  }
}

// Run the test
testSignatureService();