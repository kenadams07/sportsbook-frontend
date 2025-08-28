// Example of how to use callbacks with Redux actions

import { useDispatch } from "react-redux";
import { login, signup, verifyEmail, logout } from "../redux/Action";

// Example 1: Using callback with login
const useLoginWithCallback = () => {
  const dispatch = useDispatch();
  
  const handleLogin = (credentials) => {
    dispatch(
      login(
        { payload: credentials },
        (response) => {
          console.log("Login successful, response:", response);
          // Perform additional actions after successful login
          // e.g., navigate to dashboard, show welcome message, etc.
        }
      )
    );
  };
  
  return handleLogin;
};

// Example 2: Using callback with signup
const useSignupWithCallback = () => {
  const dispatch = useDispatch();
  
  const handleSignup = (userData) => {
    dispatch(
      signup(
        { payload: userData },
        (response) => {
          console.log("Signup successful, response:", response);
          // Perform additional actions after successful signup
          // e.g., navigate to verification page, show success message, etc.
        }
      )
    );
  };
  
  return handleSignup;
};

// Example 3: Using callback with verifyEmail
const useVerifyEmailWithCallback = () => {
  const dispatch = useDispatch();
  
  const handleVerifyEmail = (emailData) => {
    dispatch(
      verifyEmail(
        { payload: emailData },
        (response) => {
          console.log("Email verification successful, response:", response);
          // Perform additional actions after successful email verification
          // e.g., navigate to home page, show success message, etc.
        }
      )
    );
  };
  
  return handleVerifyEmail;
};

// Example 4: Using callback with logout
const useLogoutWithCallback = () => {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(
      logout(
        {},
        (response) => {
          console.log("Logout successful, response:", response);
          // Perform additional actions after successful logout
          // e.g., navigate to login page, clear local storage, etc.
        }
      )
    );
  };
  
  return handleLogout;
};

export {
  useLoginWithCallback,
  useSignupWithCallback,
  useVerifyEmailWithCallback,
  useLogoutWithCallback
};