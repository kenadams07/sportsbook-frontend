import React, { useState } from "react";
import { Mail, Check, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsVerified(true);
      toast.success("Email verified successfully!");
      
      // Redirect to login after successful verification
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Verification code resent to your email");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-400 mb-6">
              Your email has been successfully verified. You can now access all features of SportsBook.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting you to login...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">S</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-400 text-sm">
              We've sent a verification code to your email address. Please enter the code below to complete your registration.
            </p>
          </div>

          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#404040] rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="bg-[#404040] border-[#404040] text-white placeholder:text-gray-400 h-12 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-yellow-500 hover:text-yellow-400 underline text-sm"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Resending...
                </div>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          {/* Back to Home */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Footer */}
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