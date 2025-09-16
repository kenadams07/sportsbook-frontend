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

// Signup endpoint
app.post('/users/signup', (req, res) => {
  const { email, password, username, name, birthdate, currency } = req.body;
  
  // Simulate network delay
  setTimeout(() => {
    // Basic validation
    if (!email || !password || !username || !name || !birthdate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      username,
      name,
      birthdate,
      currency: currency || 'GBP',
      emailVerification: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    console.log('New user registered:', newUser);
    
    return res.json({
      success: true,
      message: 'User registered successfully',
      token: 'mock-jwt-token-' + newUser.id,
      data: newUser
    });
  }, 1000); // Simulate network delay
});

// Login endpoint
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulate network delay
  setTimeout(() => {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // In a real app, you would verify the password here
    // For mock purposes, we'll just assume it's correct
    
    console.log('User logged in:', user);
    
    return res.json({
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-' + user.id,
      data: user
    });
  }, 1000); // Simulate network delay
});

// Verify email endpoint
app.post('/users/verifyemail', (req, res) => {
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
app.post('/users/forget-password', (req, res) => {
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
  console.log('- POST /users/signup (for user registration)');
  console.log('- POST /users/login (for user login)');
  console.log('- POST /users/verifyemail (for email verification)');
  console.log('- POST /users/forget-password (for password reset)');
  console.log('Test valid OTP: 123456');
});