import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import './Login.css';

const Login = () => {
  const { login, testLogin } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    try {
      const result = await login(credentials);
      if (result.success) {
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Test login function for development
  const handleTestLogin = () => {
    testLogin();
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="overlay">
          <div className="logo">
            <h1>SportsBet Admin</h1>
          </div>
          <div className="sports-illustration">
            {/* Sports image from public folder */}
            <img 
              src="/sports.jpg" 
              alt="Sports illustration" 
              className="sports-image"
              onError={(e) => {
                e.target.style.display = 'none';
                // Show placeholder if image fails to load
                const placeholder = document.querySelector('.sports-image-placeholder');
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
            {/* Fallback placeholder */}
            <div className="sports-image-placeholder">
              <div className="placeholder-content">
                <div className="sports-icon">⚽🏀🏈</div>
                <div className="placeholder-text">Sports Illustration</div>
              </div>
            </div>
          </div>
          <div className="tagline">
            <h2>Manage Your Sportsbook Platform</h2>
            <p>Access comprehensive analytics and management tools</p>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please sign in to your account</p>
          </div>
          
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              error={errors.email}
              label="Email Address"
            />
            
            <Input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              error={errors.password}
              label="Password"
            />
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>
            
            <Button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            {/* Test login button for development - remove in production */}
            <Button 
              type="button" 
              variant="secondary"
              className="test-login-button"
              onClick={handleTestLogin}
              style={{ marginTop: '10px' }}
            >
              Test Login (Skip Authentication)
            </Button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#signup">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;