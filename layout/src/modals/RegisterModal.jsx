"use client";

import { useState } from "react";
import { useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
import { Paths } from "../routes/path";

import { useDispatch } from "react-redux";
import { signup } from "../redux/Action/auth/signupAction";

export default function RegisterModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [shouldReopenRegister, setShouldReopenRegister] = useState(false);
  const [date, setDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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

  // Handle reopening register modal when coming back from login modal
  useEffect(() => {
    if (shouldReopenRegister && !isLoginModalOpen) {
      setShouldReopenRegister(false);
      // Don't close the register modal, just reset the flag
    }
  }, [shouldReopenRegister, isLoginModalOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataWithDate = {
      ...formData,
      birthdate: date ? format(date, "yyyy-MM-dd") : "",
    };

    dispatch(
      signup({
        payload: formDataWithDate
      })
    );
    
    // Close modal and navigate to verify email page
    onClose();
    navigate(Paths.verifyEmail);
  };

  const handleSwitchToLogin = () => {
    setIsLoginModalOpen(true);
    // Don't close register modal immediately - let it stay in background
  };

  const fieldClass =
    "bg-[#404040] border-[#404040] text-white placeholder:text-gray-400 h-12 text-base w-full px-3 flex items-center justify-between";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full mx-auto bg-[#2a2a2a] text-white p-0 max-h-[85vh] overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Register</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            <DialogHeader className="flex flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">SportsBook</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSwitchToLogin}
                  variant="ghost"
                  className="text-white hover:text-yellow-500 text-sm underline"
                >
                  SIGN IN
                </Button>
              </div>
            </DialogHeader>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">New to sportsbook?</p>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Register here, it's easy!
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Username with Floating Label */}
                    <div className="floating-input-container">
                      <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className={`floating-input ${formData.username ? 'has-value' : ''}`}
                      />
                      <label className="floating-label">Username</label>
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                      )}
                    </div>

                    {/* Name with Floating Label */}
                    <div className="floating-input-container">
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`floating-input ${formData.name ? 'has-value' : ''}`}
                      />
                      <label className="floating-label">Name</label>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email with Floating Label */}
                    <div className="floating-input-container">
                      <input
                        type="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`floating-input ${formData.email ? 'has-value' : ''}`}
                      />
                      <label className="floating-label">E-mail</label>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Calendar Picker with Floating Label Style */}
                    <div className="floating-input-container">
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="floating-input justify-start text-left font-normal border-[#404040] hover:bg-[#404040] bg-[#404040]"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span className="text-transparent">Birth Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <label className={`floating-label ${date ? 'top-0 text-xs text-yellow-500 bg-[#2a2a2a] px-1' : ''}`}>
                          Birth Date
                        </label>

                        <PopoverContent
                          className="w-full max-w-[350px] p-0 bg-[#2a2a2a] border-gray-600"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                setDate(selectedDate);
                                handleInputChange("birthdate", format(selectedDate, "yyyy-MM-dd"));
                                setIsCalendarOpen(false);
                              }
                            }}
                            initialFocus
                            className="bg-[#2a2a2a] text-white"
                            classNames={{
                              day_selected: "bg-yellow-500 text-black hover:bg-yellow-600 hover:text-black",
                              day_today: "border border-yellow-500",
                              day_outside: "text-gray-500",
                              day_disabled: "text-gray-700",
                              head_cell: "text-gray-400",
                              button: "hover:bg-[#404040]",
                              nav_button: "border-gray-600 hover:bg-[#404040]",
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {errors.birthdate && (
                        <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>
                      )}
                    </div>

                    {/* Password with Floating Label */}
                    <div className="floating-input-container">
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`floating-input ${formData.password ? 'has-value' : ''}`}
                      />
                      <label className="floating-label">Password</label>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password with Floating Label */}
                    <div className="floating-input-container">
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`floating-input ${formData.confirmPassword ? 'has-value' : ''}`}
                      />
                      <label className="floating-label">Confirm password</label>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base"
                  >
                    REGISTER
                  </Button>
                </div>
              </form>

              <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-600">
                <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
                  <User className="w-4 h-4 mr-2" />
                  Contact support
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setShouldReopenRegister(true);
          // Register modal should remain open (don't call onClose)
        }}
      />
    </>
  );
}
