import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { X, User, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/Action/auth/loginAction";
import { verifyEmail } from "../redux/Action/auth/verifyEmailAction";
import { notifyError, notifySuccess } from "../utils/notificationService";
import { OTPInput } from "../components/ui/otp-input";

export default function MobileLoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    },
  });

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.Login);
  const verifyEmailState = useSelector((state) => state?.VerifyEmail);

  // Watch form values to manage floating labels
  const emailOrUsername = watch("emailOrUsername");
  const password = watch("password");

  // Forgot password state
  const [forgotPasswordStep, setForgotPasswordStep] = useState("login"); // login, otp, newPassword
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpInputDisabled, setIsOtpInputDisabled] = useState(true);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      reset({
        emailOrUsername: "",
        password: "",
        rememberMe: false,
      });
    }
  }, [isOpen, reset]);

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  // Timer for OTP resend
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

  // Handle forgot password response
  useEffect(() => {
    if (forgotPasswordStep === "otp" && verifyEmailState?.success && !verifyEmailState?.loading) {
      // Check if this is OTP send success (no otp property in data)
      if (!verifyEmailState?.data?.hasOwnProperty("otp")) {
        setIsOtpInputDisabled(false);
        setIsTimerOn(true);
        setTimeLeft(120);
        notifySuccess("OTP sent to your email");
      }
    }
  }, [verifyEmailState, forgotPasswordStep]);

  const handleClose = () => {
    // Clear all errors when closing modal
    reset({
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    });
    // Reset forgot password state
    setForgotPasswordStep("login");
    setForgotEmail("");
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
    setIsOtpInputDisabled(true);
    setIsTimerOn(false);
    setTimeLeft(0);
    setIsLoading(false);
    setVerificationStatus("");
    onClose();
  };

  const onSubmit = (data) => {
    // Dispatch login action
    dispatch(login(data));
  };

  const handleForgotPassword = () => {
    // Check if email is provided
    if (!emailOrUsername) {
      notifyError("Please enter email");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailOrUsername)) {
      notifyError("Please enter a valid email address");
      return;
    }

    console.log("emailOrUsername", emailOrUsername);
    setForgotEmail(emailOrUsername);
    setForgotPasswordStep("otp");
    setOtpCode("");
    setIsOtpInputDisabled(true);
    
    // Dispatch forgot password action
    dispatch(
      verifyEmail({
        payload: { email: emailOrUsername },
        route: "FP" // Forget Password route
      })
    );
  };

  const handleResendOTP = () => {
    if (!forgotEmail) return;
    
    setOtpCode("");
    setIsOtpInputDisabled(true);
    
    dispatch(
      verifyEmail({
        payload: { email: forgotEmail },
        route: "FP" 
      })
    );
  };

  const handleVerifyOTP = () => {
    if (!otpCode || otpCode.length !== 6) {
      notifyError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setVerificationStatus("Verifying");

    dispatch(
      verifyEmail({
        payload: { email: forgotEmail, otp: otpCode },
        route: "FP"
      }, (response) => {
        setIsLoading(false);
        setVerificationStatus("");
        if (response?.code === 200) {
          setForgotPasswordStep("newPassword");
          notifySuccess("OTP verified successfully");
        }
      })
    );
  };

  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      notifyError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setVerificationStatus("Resetting password");

    // TODO: Call password reset endpoint with email and newPassword
    // For now, this is a placeholder - you'll need to implement the actual endpoint
    setTimeout(() => {
      setIsLoading(false);
      setVerificationStatus("");
      notifySuccess("Password reset successfully");
      handleClose();
    }, 1000);
  };

  const handleBackToLogin = () => {
    setForgotPasswordStep("login");
    setForgotEmail("");
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
    setIsOtpInputDisabled(true);
    setIsTimerOn(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Mobile Login Modal */}
      <div className="absolute bottom-0 left-0 right-0 h-5/6 max-h-[90vh] bg-[#2a2a2a] text-white rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold">SportsBook</span>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Login Form */}
            {forgotPasswordStep === "login" && (
              <>
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">Already have an account?</p>
                  <h2 className="text-xl font-bold">Sign in, we are waiting for you</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email / Username */}
                  <Input
                    type="text"
                    placeholder="Email / Username"
                    error={errors.emailOrUsername?.message}
                    {...register("emailOrUsername", {
                      required: "Email or username is required",
                    })}
                  />

                  {/* Password */}
                  <Input
                    type="password"
                    placeholder="Password"
                    error={errors.password?.message}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                  />

                  {/* Remember me and Forgot Password */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        className="border-gray-400 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                        {...register("rememberMe")}
                      />
                      <label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-gray-400 hover:text-yellow-500 cursor-pointer underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base"
                    >
                      SIGN IN
                    </Button>
                  </div>
                </form>

                {/* Join Us Button */}
                <div className="mt-6 p-4 bg-[#333333] rounded text-center">
                  <p className="text-gray-400 text-sm">
                    Have no account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        handleClose(); // Close login modal
                        onSwitchToRegister(); // Open register modal
                      }}
                      className="text-yellow-500 hover:text-yellow-400 underline font-medium"
                    >
                      Join us
                    </button>
                  </p>
                </div>

                {/* Safer Gambling Message */}
                <div className="mt-4 p-3 bg-[#333333] rounded">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Safer Gambling message. Set limits on your gambling. For support, contact the National Gambling Helpline
                    on <span className="text-white font-medium">0808 8020 133</span>
                  </p>
                </div>

                {/* Logos */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                      <div>GAMBLING</div>
                      <div>COMMISSION</div>
                    </div>
                    <div className="text-xs text-gray-500">GambleAware</div>
                    <div className="bg-gray-600 px-2 py-1 rounded text-xs text-white">18+</div>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="flex items-center justify-center mt-4">
                  <Button variant="ghost" className="text-gray-400 hover:text-white text-sm hover:bg-[#404040]">
                    <User className="w-4 h-4 mr-2" />
                    Contact support
                  </Button>
                </div>
              </>
            )}

            {/* OTP Verification */}
            {forgotPasswordStep === "otp" && (
              <>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm text-gray-400 hover:text-yellow-500 mb-4 flex items-center gap-1"
                  >
                    ← Back to Login
                  </button>
                  <h2 className="text-xl font-bold mb-2">Verify OTP</h2>
                  <p className="text-gray-400 text-sm">
                    We've sent a verification code to <span className="text-yellow-500">{forgotEmail}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#404040] rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center mb-4">
                      <OTPInput
                        value={otpCode}
                        onChange={setOtpCode}
                        disabled={isOtpInputDisabled}
                        length={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otpCode.length !== 6 || isOtpInputDisabled}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {verificationStatus || "Verifying..."}
                      </div>
                    ) : (
                      verificationStatus || "Verify OTP"
                    )}
                  </Button>

                  <div className="text-center">
                    {isTimerOn ? (
                      <div className="text-sm text-gray-400">
                        Didn't receive the code?{" "}
                        <button
                          type="button"
                          disabled={isTimerOn}
                          className="text-yellow-500 font-medium disabled:opacity-50"
                        >
                          Resend in {formatTime(timeLeft)}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-sm text-yellow-500 hover:text-yellow-400 font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* New Password */}
            {forgotPasswordStep === "newPassword" && (
              <>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm text-gray-400 hover:text-yellow-500 mb-4 flex items-center gap-1"
                  >
                    ← Back to Login
                  </button>
                  <h2 className="text-xl font-bold mb-2">Reset Password</h2>
                  <p className="text-gray-400 text-sm">
                    Enter your new password for <span className="text-yellow-500">{forgotEmail}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {verificationStatus || "Resetting..."}
                      </div>
                    ) : (
                      verificationStatus || "Reset Password"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}