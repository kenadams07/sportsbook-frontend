"use client";

import { useState } from "react";
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

import { useDispatch } from "react-redux";
import { signup } from "../redux/Action/auth/signupAction";

export default function RegisterModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    middlename: "",
    email: "",
    surname: "",
    gender: "",
    birthdate: "",
    zipcode: "",
    address: "",
    occupation: "",
    salaryLevel: "",
    currency: "GBP",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.surname) newErrors.surname = "Surname is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.birthdate) newErrors.birthdate = "Birth date is required";
    if (!formData.zipcode) newErrors.zipcode = "Zip code is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    if (!formData.salaryLevel) newErrors.salaryLevel = "Salary level is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    const formDataWithDate = {
      ...formData,
      birthdate: date ? format(date, "yyyy-MM-dd") : "",
    };

    dispatch(
      signup({
        payload: formDataWithDate
      })
    );
  };

  const handleSwitchToLogin = () => {
    onClose();
    setIsLoginModalOpen(true);
  };

  const fieldClass =
    "bg-[#404040] border-[#404040] text-white placeholder:text-gray-400 h-12 text-base w-full px-3 flex items-center justify-between";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl w-full mx-auto bg-[#2a2a2a] text-white p-0 max-h-[85vh] overflow-hidden">
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <Input
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
                    )}

                    <Input
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}

                    <Input
                      placeholder="Middle name"
                      value={formData.middlename}
                      onChange={(e) => handleInputChange("middlename", e.target.value)}
                      className={fieldClass}
                    />

                    <Input
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}

                    <Input
                      placeholder="Surname"
                      value={formData.surname}
                      onChange={(e) => handleInputChange("surname", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.surname && (
                      <p className="text-red-500 text-sm">{errors.surname}</p>
                    )}

                    <Select
                      value={formData.gender || ""}
                      onValueChange={(val) => handleInputChange("gender", val)}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="Choose gender" />
                      </SelectTrigger>

                      <SelectContent className="bg-[#404040] border-[#404040] p-0" align="start">
                        <SelectItem value="male" className="text-white h-12 px-3 flex items-center">
                          Male
                        </SelectItem>
                        <SelectItem value="female" className="text-white h-12 px-3 flex items-center">
                          Female
                        </SelectItem>
                        <SelectItem value="other" className="text-white h-12 px-3 flex items-center">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm">{errors.gender}</p>
                    )}

                    {/* Calendar Picker */}
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`${fieldClass} justify-start text-left font-normal border-[#404040] hover:bg-[#404040]`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Birth Date</span>}
                        </Button>
                      </PopoverTrigger>

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
                      <p className="text-red-500 text-sm">{errors.birthdate}</p>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <Input
                      placeholder="Zip code"
                      value={formData.zipcode}
                      onChange={(e) => handleInputChange("zipcode", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.zipcode && (
                      <p className="text-red-500 text-sm">{errors.zipcode}</p>
                    )}

                    <Input
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}

                    <Select
                      value={formData.occupation || ""}
                      onValueChange={(val) => handleInputChange("occupation", val)}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="Choose occupation" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#404040] border-[#404040]">
                        <SelectItem value="student" className="text-white">Student</SelectItem>
                        <SelectItem value="employed" className="text-white">Employed</SelectItem>
                        <SelectItem value="self-employed" className="text-white">Self-employed</SelectItem>
                        <SelectItem value="unemployed" className="text-white">Unemployed</SelectItem>
                        <SelectItem value="retired" className="text-white">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.occupation && (
                      <p className="text-red-500 text-sm">{errors.occupation}</p>
                    )}

                    <Select
                      value={formData.salaryLevel || ""}
                      onValueChange={(val) => handleInputChange("salaryLevel", val)}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="Choose salary level" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#404040] border-[#404040]">
                        <SelectItem value="0-25k" className="text-white">£0 - £25,000</SelectItem>
                        <SelectItem value="25k-50k" className="text-white">£25,000 - £50,000</SelectItem>
                        <SelectItem value="50k-75k" className="text-white">£50,000 - £75,000</SelectItem>
                        <SelectItem value="75k+" className="text-white">£75,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.salaryLevel && (
                      <p className="text-red-500 text-sm">{errors.salaryLevel}</p>
                    )}

                    <Input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}

                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={fieldClass}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
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
      />
    </>
  );
}
