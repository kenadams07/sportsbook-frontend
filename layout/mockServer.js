import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 4001; // Changed port to avoid conflict

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let users = [
  { id: 1, email: 'test@example.com', emailVerification: false }
];

// Verify email endpoint
app.post('/verifyemail', (req, res) => {
  const { type, OTP } = req.body.payload;
  
  // Simulate network delay
  setTimeout(() => {
    if (type === 'requestOTP') {
      // Simulate sending OTP
      console.log('Sending OTP to user email');
      return res.json({
        meta: { code: 200, message: 'OTP sent successfully' },
        data: { type: 'requestOTP', message: 'OTP sent to your email' }
      });
    } else if (type === 'submitOTP') {
      // Simulate OTP verification
      if (OTP === '123456') { // For testing, use 123456 as valid OTP
        console.log('OTP verified successfully');
        return res.json({
          meta: { code: 200, message: 'Email verified successfully' },
          data: { 
            type: 'submitOTP', 
            message: 'Email verified successfully',
            emailVerification: true
          }
        });
      } else {
        console.log('Invalid OTP provided');
        return res.status(400).json({
          meta: { code: 400, message: 'Invalid OTP' },
          data: { type: 'submitOTP', message: 'Invalid verification code' }
        });
      }
    }
    
    // Default response
    return res.status(400).json({
      meta: { code: 400, message: 'Invalid request' },
      data: { message: 'Invalid request' }
    });
  }, 1000); // Simulate network delay
});

// Forget password endpoint
app.post('/forget-password', (req, res) => {
  // Simulate network delay
  setTimeout(() => {
    console.log('Forget password request received');
    return res.json({
      meta: { code: 200, message: 'Password reset instructions sent' },
      data: { message: 'Password reset instructions sent to your email' }
    });
  }, 1000); // Simulate network delay
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /verifyemail (for email verification)');
  console.log('- POST /forget-password (for password reset)');
  console.log('Test valid OTP: 123456');
});