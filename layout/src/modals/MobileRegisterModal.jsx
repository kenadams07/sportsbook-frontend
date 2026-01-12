import { useState } from "react";
import { useEffect } from "react";
import { X, User, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";

import {
  Input
} from "../components/ui/input";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Paths } from "../routes/path";

import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/Action/auth/signupAction";
import { login } from "../redux/Action/auth/loginAction";

export default function MobileRegisterModal({ isOpen, onClose, onCloseAll, onSwitchToLogin }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.Login);
  const navigate = useNavigate();
  // We no longer need date state since we're using a simple input field
  // const [date, setDate] = useState(null);
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false); // Added consent state
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    birthdate: "",
    currency: "GBP",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Clear errors and form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setFormData({
        username: "",
        name: "",
        email: "",
        birthdate: "",
        currency: "GBP",
        password: "",
        confirmPassword: "",
      });
      // setDate(null); // No longer needed
      setIsConsentChecked(false); // Reset consent checkbox
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleClose = () => {
    // Clear all errors and form data when closing modal
    setErrors({});
    setFormData({
      username: "",
      name: "",
      email: "",
      birthdate: "",
      currency: "GBP",
      password: "",
      confirmPassword: "",
    });
    // setDate(null); // No longer needed
    setIsConsentChecked(false); // Reset consent checkbox
    
    // Call the appropriate close function
    if (onCloseAll) {
      onCloseAll();
    } else {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.birthdate) newErrors.birthdate = "Birth date is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!isConsentChecked) newErrors.consent = "You must agree to the terms and conditions"; // Added consent validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(signup(formData));
  };

  // Close modal and navigate when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      handleClose();
    }
  }, [isAuthenticated, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Mobile Register Modal */}
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
              <p className="text-gray-400 text-sm mb-2">New to sportsbook?</p>
              <h2 className="text-xl font-bold">
                Register here, it's easy!
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <Input
                type="text"
                placeholder="Username"
                value={formData.username}
                error={errors.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />

              {/* Name */}
              <Input
                type="text"
                placeholder="Name"
                value={formData.name}
                error={errors.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />

              {/* Email */}
              <Input
                type="email"
                placeholder="E-mail"
                value={formData.email}
                error={errors.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              {/* Password */}
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                error={errors.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />

              {/* Confirm Password */}
              <Input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />

              {/* Birth Date */}
              <Input
                type="date"
                placeholder="Birth Date"
                value={formData.birthdate}
                error={errors.birthdate}
                onChange={(e) => handleInputChange("birthdate", e.target.value)}
              />

              {/* Consent Checkbox */}
              <div className="pt-2">
                <div className="flex items-start">
                  <Checkbox
                    id="consent"
                    checked={isConsentChecked}
                    onCheckedChange={setIsConsentChecked}
                    className="mt-1 border-gray-400 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <label htmlFor="consent" className="ml-2 text-sm text-gray-300">
                    By signing up, I confirm that I am at least 18 years old and understand that betting involves real money and carries a risk of financial loss. I acknowledge that gambling can become addictive and agree to participate responsibly. I accept that the platform is not responsible for any losses incurred and that I am solely responsible for my betting activities.
                  </label>
                </div>
                {errors.consent && (
                  <p className="input-error mt-1 text-sm">
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base cursor-pointer"
                  disabled={!isConsentChecked}
                >
                  REGISTER
                </Button>
              </div>
            </form>

            {/* Sign In Button */}
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    handleClose(); // Close register modal
                    onSwitchToLogin(); // Open login modal
                  }}
                  className="text-yellow-500 hover:text-yellow-400 underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>

            {/* Contact Support */}
            <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-600">
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