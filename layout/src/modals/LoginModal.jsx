import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    },
  });

  // Watch form values to manage floating labels
  const emailOrUsername = watch("emailOrUsername");
  const password = watch("password");

  useEffect(() => {
    if (isOpen) {
      setValue("emailOrUsername", "");
      setValue("password", "");
      setValue("rememberMe", false);
    }
  }, [isOpen, setValue]);

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // Place login API call here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-auto bg-[#2a2a2a] text-white p-0 max-h-[95vh] overflow-hidden">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">SportsBook</span>
            </div>
          </DialogHeader>

          {/* Hidden DialogTitle for accessibility */}
          <DialogTitle className="sr-only">Login to SportsBook</DialogTitle>
          
          {/* Hidden DialogDescription for accessibility */}
          <DialogDescription className="sr-only">
            Sign in to your SportsBook account to access your betting features and account information.
          </DialogDescription>

          {/* Content */}
          <div className="px-4 sm:px-6 pb-6 overflow-y-auto">
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Already have an account?</p>
              <h2 className="text-xl sm:text-2xl font-bold">Sign in, we are waiting for you</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email / Username with Floating Label */}
              <div className="floating-input-container">
                <input
                  type="text"
                  placeholder="Email / Username"
                  className={`floating-input ${emailOrUsername ? 'has-value' : ''}`}
                  {...register("emailOrUsername", {
                    required: "Email or username is required",
                  })}
                />
                <label className="floating-label">Email / Username</label>
                {errors.emailOrUsername && (
                  <p className="text-red-500 text-sm mt-1">{errors.emailOrUsername.message}</p>
                )}
              </div>

              {/* Password with Floating Label */}
              <div className="floating-input-container">
                <input
                  type="password"
                  placeholder="Password"
                  className={`floating-input ${password ? 'has-value' : ''}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                <label className="floating-label">Password</label>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="remember"
                  className="border-gray-400 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  {...register("rememberMe")}
                />
                <label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">
                  Remember me
                </label>
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

            {/* Safer Gambling Message */}
            <div className="mt-6 p-4 bg-[#333333] rounded text-center">
              <p className="text-xs text-gray-300 leading-relaxed">
                Safer Gambling message. Set limits on your gambling. For support, contact the National Gambling Helpline
                on <span className="text-white font-medium">0808 8020 133</span>
              </p>
              <div className="mt-3">
                <p className="text-gray-400 text-xs">
                  Have no account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      onClose(); // Close login modal
                      onSwitchToRegister(); // Open register modal
                    }}
                    className="text-yellow-500 hover:text-yellow-400 underline"
                  >
                    Join us
                  </button>
                </p>
              </div>
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

            {/* Forgot Password */}
            <div className="mt-6 pt-4 border-t border-gray-600 text-center">
              <Button variant="ghost" className="text-gray-400 hover:text-white text-sm font-medium">
                FORGOT YOUR PASSWORD?
              </Button>
            </div>

            {/* Contact Support */}
            <div className="flex items-center justify-center mt-4">
              <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
                <User className="w-4 h-4 mr-2" />
                Contact support
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}