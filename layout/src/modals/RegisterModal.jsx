import { useState } from "react";
import { useEffect } from "react";
import { User, Calendar as CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { Checkbox } from "../components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { toast } from "sonner";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
import { Paths } from "../routes/path";

import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/Action/auth/signupAction";
import { Input } from "../components/ui/input";

export default function RegisterModal({ isOpen, onClose, onCloseAll }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.Login);
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [shouldReopenRegister, setShouldReopenRegister] = useState(false);
  const [date, setDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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

  // Handle reopening register modal when coming back from login modal
  useEffect(() => {
    if (shouldReopenRegister && !isLoginModalOpen) {
      setShouldReopenRegister(false);
      // Don't close the register modal, just reset the flag
    }
  }, [shouldReopenRegister, isLoginModalOpen]);

  // Close modal when user becomes authenticated (after successful signup)
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      handleClose();
    }
  }, [isAuthenticated, isOpen]);

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
      setDate(null);
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
    setDate(null);
    setIsConsentChecked(false); // Reset consent checkbox
    
    // Close the embedded login modal if it's open
    setIsLoginModalOpen(false);
    
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

    const formDataWithDate = {
      ...formData,
      birthdate: date ? format(date, "yyyy-MM-dd") : "",
    };
  
    dispatch(
      signup(
        formDataWithDate,  // Pass the form data directly, not nested
        (response) => {
          console.log("Signup successful, response:", response);
          handleClose();
          navigate(Paths.verifyEmail);
        }
      )
    );
  };

  const handleSwitchToLogin = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl w-full mx-auto bg-[#2a2a2a] text-white p-0 max-h-[85vh] overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <DialogTitle className="text-xl font-bold m-0">SportsBook</DialogTitle>
            </div>
            <div className="flex items-center gap-4 mr-4">
              <Button
                onClick={handleSwitchToLogin}
                variant="ghost"
                className="text-white hover:text-yellow-500 text-sm underline"
              >
                SIGN IN
              </Button>
            </div>
          </DialogHeader>

          {/* Hidden DialogDescription for accessibility */}
          <DialogDescription className="sr-only">
            Register for a new SportsBook account to access betting features and account information.
          </DialogDescription>

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
                  {/* Username */}
                  <Input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    error={errors.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
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
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Name */}
                  <Input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    error={errors.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />

                  {/* Calendar Picker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Birth Date
                    </label>
                    <div className="relative">
                      <Popover modal={true} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={`justify-start text-left font-normal border-[#404040] hover:bg-[#404040] bg-[#404040] h-12 w-full rounded-md px-3 ${
                              errors.birthdate ? "border-destructive" : ""
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span className="text-gray-400">Select birth date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full max-w-[350px] p-0 bg-[#2a2a2a] border-gray-600 z-[100]"
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
                            disabled={(date) => date > new Date()} // Only restrict future dates, removed the 18-year restriction
                            initialFocus
                            className="bg-[#2a2a2a] text-white"
                            captionLayout="dropdown" // Using dropdown for manual selection
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            classNames={{
                              day_selected: "bg-yellow-500 text-black hover:bg-yellow-600 hover:text-black",
                              day_today: "border border-yellow-500",
                              day_outside: "text-gray-500",
                              day_disabled: "text-gray-700 opacity-50 cursor-not-allowed",
                              head_cell: "text-gray-400",
                              button: "hover:bg-[#404040]",
                              nav_button: "border-gray-600 hover:bg-[#404040]",
                              caption_label: "hidden", // Hide the duplicate label
                              caption_dropdowns: "flex gap-3 items-center", // Gap between dropdowns
                              dropdown: "bg-[#404040] text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500",
                              dropdown_month: "bg-[#404040] text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500",
                              dropdown_year: "bg-[#404040] text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500",
                            }}
                            components={{
                              Caption: (props) => {
                                const { goToPrevious, goToNext, previousMonth, nextMonth } = props;
                                return (
                                  <div className="flex items-center justify-between py-2 mb-0 bg-[#2a2a2a] px-2">
                                    <button
                                      type="button"
                                      onClick={goToPrevious}
                                      className="border-gray-600 hover:bg-[#404040] p-1 rounded disabled:opacity-50"
                                      disabled={!previousMonth}
                                    >
                                      <ChevronLeftIcon className="size-4" />
                                    </button>
                                    <div className="flex gap-3 items-center">
                                      {props.children}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={goToNext}
                                      className="border-gray-600 hover:bg-[#404040] p-1 rounded disabled:opacity-50"
                                      disabled={!nextMonth}
                                    >
                                      <ChevronRightIcon className="size-4" />
                                    </button>
                                  </div>
                                );
                              }
                            }}
                          />

                        </PopoverContent>
                      </Popover>
                    </div>
                    {errors.birthdate && (
                      <p className="input-error mt-1">
                        {errors.birthdate}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      error={errors.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                    {/* Adding an empty div with the same height as an error message to maintain alignment when no error is present */}
                    {!errors.confirmPassword && (
                      <div className="h-[1.25rem] mt-1"></div>
                    )}
                  </div>
                </div>
              </div>

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

              <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-600">
                <Button variant="ghost" className="text-gray-400 hover:text-white text-sm hover:bg-[#404040]">
                  <User className="w-4 h-4 mr-2" />
                  Contact support
                </Button>
              </div>
            </form>

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