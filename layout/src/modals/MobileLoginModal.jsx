import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/Action/auth/loginAction";
import { verifyEmail } from "../redux/Action/auth/verifyEmailAction";
import { notifyError } from "../utils/notificationService";

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

  // Watch form values to manage floating labels
  const emailOrUsername = watch("emailOrUsername");
  const password = watch("password");

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

  const handleClose = () => {
    // Clear all errors when closing modal
    reset({
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    });
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
    console.log("emailOrUsername",emailOrUsername)
    // Dispatch forgot password action
    dispatch(
      verifyEmail({
        payload: { email: emailOrUsername },
        route: "FP" // Forget Password route
      })
    );
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

            {/* Forgot Password Button */}
            <div className="mt-6 pt-4 border-t border-gray-600 text-center">
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white text-sm font-medium hover:bg-[#404040] w-full"
                onClick={handleForgotPassword}
              >
                FORGOT YOUR PASSWORD?
              </Button>
            </div>

            {/* Contact Support */}
            <div className="flex items-center justify-center mt-4">
              <Button variant="ghost" className="text-gray-400 hover:text-white text-sm hover:bg-[#404040]">
                <User className="w-4 h-4 mr-2" />
                Contact support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}