import React, { useState, useEffect, useRef } from "react";
import { Mail, Check, RefreshCw, ArrowLeft, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { OTPInput } from "../components/ui/otp-input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../redux/Action/auth/verifyEmailAction";
import { Paths } from "../routes/path";
import { setLocalStorageItem } from "../utils/Helper";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState("");
  const timerRef = useRef(null);

  const userData = useSelector((state) => state?.Login?.userData);
  const verifyEmailState = useSelector((state) => state?.VerifyEmail);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleSendOTP = () => {
    if (!userData?.email) {
      // Removed toast notification to prevent duplication
      // Error handling is now in the saga
      return;
    }

    setVerificationCode("");
    setIsInputDisabled(false);
    setIsTimerOn(true);
    setTimeLeft(120);

    const payload = {
      email: userData?.email,
      route: "VE",
    };

    dispatch(
      verifyEmail({
        payload,
        route: "VE",
      })
    );
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!userData?.email) {
      // Removed toast notification to prevent duplication
      // Error handling is now in the saga
      return;
    }

    if (!verificationCode.trim()) {
      // Removed toast notification to prevent duplication
      // Error handling is now in the saga
      return;
    }

    if (verificationCode.length !== 6) {
      // Removed toast notification to prevent duplication
      // Error handling is now in the saga
      return;
    }

    setIsLoading(true);
    setVerificationStatus("Verifying");

    const payload = {
      email: userData?.email,
      otp: verificationCode,
    };

    dispatch(
      verifyEmail({
        payload,
        route: "VE",
      }, (response) => {
        console.log("verified otp", response);
        if (response?.code == 200) {
          // Set flag in localStorage to show welcome modal on homepage
          setLocalStorageItem('showWelcomeModal', 'true');
          
          // Navigate to the home page directly
          navigate(Paths.home);
        }
      })
    );
  };

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isTimerOn) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setIsTimerOn(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerOn]);

  useEffect(() => {
    if (verifyEmailState?.loading) {
      // Removed direct toast notifications to prevent duplicates
      // The notifications are now handled in the saga
    } else if (verifyEmailState?.success) {
      if (!verifyEmailState?.data?.hasOwnProperty("otp")) {
        // Removed duplicate toast notification
        // Notification is handled in the saga
      } else if (verifyEmailState?.data?.hasOwnProperty("otp")) {
        setIsLoading(false);
        setVerificationStatus("Verification Success");
        setIsVerified(true);
        // Removed duplicate toast notification
        // Notification is handled in the saga
        
        // Set flag in localStorage to show welcome modal on homepage
        setLocalStorageItem('showWelcomeModal', 'true');
        
        // Navigate to the home page
        setTimeout(() => {
          navigate(Paths.home);
        }, 1000);
      }
    } else if (verifyEmailState?.error) {
      if (!verifyEmailState?.data?.hasOwnProperty("otp")) {
        // Removed duplicate toast notification
        // Notification is handled in the saga
        setIsInputDisabled(false);
      } else if (verifyEmailState?.data?.hasOwnProperty("otp")) {
        // Reset loading state and verification status when verification fails
        setIsLoading(false);
        setVerificationStatus("");
        // Removed duplicate toast notification
        // Notification is handled in the saga
        setIsInputDisabled(false);
      }
    }
  }, [verifyEmailState, navigate]);

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Email Verified!</h1>
            <p className="text-gray-400 mb-6">
              Your email has been successfully verified. You can now access all features of SportsBook.
            </p>
            <div className="text-sm text-gray-500">Redirecting you to home page...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">S</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-400 text-sm">
              We've sent a verification code to your email address. Please enter the code below to complete your registration.
            </p>
            {userData?.email && (
              <p className="text-yellow-500 text-sm mt-2 font-medium">
                {userData.email}
              </p>
            )}
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#404040] rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <div className="flex justify-center mb-2">
                <OTPInput
                  id="verificationCode"
                  value={verificationCode}
                  onChange={setVerificationCode}
                  disabled={isInputDisabled}
                  length={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                {isTimerOn
                  ? "Didn't receive the code? You can resend in: "
                  : "Click 'Send OTP' to receive verification code"}
              </p>
              <div className="flex justify-center mt-4">

                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isTimerOn}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-8 text-sm disabled:opacity-50"
                >
                  {isTimerOn ? formatTime(timeLeft) : (
                    <div className="flex items-center gap-1">
                      <Send className="w-3 h-3" />
                      Send OTP
                    </div>
                  )}
                </Button>
              </div>

            </div>

            <Button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6 || isInputDisabled}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {verificationStatus || "Verifying..."}
                </div>
              ) : (
                verificationStatus || "Verify Email"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-600">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white flex items-center justify-center gap-2 hover:bg-[#404040]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By verifying your email, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}