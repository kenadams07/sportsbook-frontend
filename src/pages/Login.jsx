import React, { useMemo, useState } from 'react';
import { FiEye, FiEyeOff, FiLock, FiShield } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login, testLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
    rememberDevice: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const sessionMessage = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('session') === 'expired' || params.get('timeout') === 'true';
  }, [location.search]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    setCredentials((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name] || errors.general) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
        general: ''
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const identifier = credentials.identifier.trim();

    if (!identifier) {
      nextErrors.identifier = 'Please enter your email address or username.';
    } else if (identifier.includes('@') && !/^\S+@\S+\.\S+$/.test(identifier)) {
      nextErrors.identifier = 'Email address needs a valid format. Example: ops@example.com';
    }

    if (!credentials.password) {
      nextErrors.password = 'Please enter your password.';
    } else if (credentials.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({
        email: credentials.identifier.trim(),
        password: credentials.password,
        rememberDevice: credentials.rememberDevice
      });

      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        general: 'We could not verify those credentials. Check your access details and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = () => {
    testLogin();
    navigate('/dashboard');
  };

  return (
    <main className="login-page" aria-labelledby="login-title">
      <section className="login-shell" aria-label="Sportsbook admin authentication">
        <div className="login-context" aria-hidden="true">
          <div className="context-kicker">Sportsbook Admin</div>
          <h1>Critical operations access</h1>
          <p>Authenticate before entering event, market, settlement, and risk controls.</p>
          <div className="ops-signal-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card__header">
            <div className="login-icon" aria-hidden="true">
              <FiShield />
            </div>
            <div>
              <p className="login-eyebrow">Authorized personnel only</p>
              <h2 id="login-title">Operations Access</h2>
              <p>Sign in with your admin identity to continue.</p>
            </div>
          </div>

          {sessionMessage && (
            <div className="session-alert" role="status" aria-live="polite">
              <strong>Session timed out.</strong>
              <span>Sign in again to protect active sportsbook controls.</span>
            </div>
          )}

          {errors.general && (
            <div className="auth-alert" role="alert" aria-live="assertive">
              <FiLock aria-hidden="true" />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="login-field">
            <label htmlFor="identifier">Email or username</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={credentials.identifier}
              onChange={handleChange}
              placeholder="ops.admin@example.com"
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={errors.identifier ? 'identifier-error' : undefined}
              autoFocus
            />
            {errors.identifier && (
              <p className="field-error" id="identifier-error" role="alert">
                {errors.identifier}
              </p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="password-control">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p className="field-error" id="password-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="login-options">
            <label className="remember-device">
              <input
                type="checkbox"
                id="rememberDevice"
                name="rememberDevice"
                checked={credentials.rememberDevice}
                onChange={handleChange}
              />
              <span>Remember this device</span>
            </label>
            <a href="#forgot-password">Reset access</a>
          </div>

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading && <span className="submit-spinner" aria-hidden="true" />}
            <span>{isLoading ? 'Verifying access...' : 'Sign in to console'}</span>
          </button>

          <button className="test-login-link" type="button" onClick={handleTestLogin}>
            Development bypass
          </button>

          <div className="login-card__footer">
            <span>Protected admin environment</span>
            <span>Role-based access enforced after sign-in</span>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
