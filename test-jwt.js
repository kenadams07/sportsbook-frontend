const jwt = require('jsonwebtoken');

// Test with the same secret
const secret = 'sportsbook-jwt-secret-key';

// Test payload
const payload = {
  id: 'be2ed7da-be1e-4cbf-9047-5ec8cd4b619d',
  email: 'test5@example.com',
  role: 0,
  name: 'Test User 5'
};

console.log('Secret:', secret);
console.log('Payload:', payload);

// Generate a token
const token = jwt.sign(payload, secret, { expiresIn: '24h' });
console.log('Generated token:', token);

// Try to verify the token
try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded token:', decoded);
} catch (error) {
  console.error('Verification failed:', error);
}