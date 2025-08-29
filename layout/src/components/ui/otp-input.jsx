import * as React from "react";
import { cn } from "../../lib/utils";

const OTPInput = React.forwardRef(({ 
  value, 
  onChange, 
  length = 6, 
  disabled = false,
  className,
  ...props 
}, ref) => {
  const inputRefs = React.useRef([]);

  const handleChange = (elementValue, index) => {
    if (isNaN(elementValue)) return;

    // Create array from current value or fill with empty strings
    const newOtp = value ? value.split("") : Array(length).fill("");
    newOtp[index] = elementValue;

    // Update parent state
    onChange(newOtp.join(""));

    // Move to next input if value is entered and it's not the last input
    if (elementValue && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current box is empty, move to previous box
        inputRefs.current[index - 1].focus();
      } else if (value[index]) {
        // If current box has value, clear it
        const newOtp = value.split("");
        newOtp[index] = "";
        onChange(newOtp.join(""));
      }
    }
    // Handle arrow keys for navigation
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData.padEnd(length, "").slice(0, length));
      // Focus on the last filled input or the next empty one
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex].focus();
    }
  };

  // Split the value into individual characters
  const otpValues = value ? value.split("") : Array(length).fill("");

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="1"
          value={otpValues[index] || ""}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-bold rounded-md border border-gray-600 bg-[#404040] text-white",
            "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            value && value[index] ? "border-yellow-500" : ""
          )}
          {...props}
        />
      ))}
    </div>
  );
});

OTPInput.displayName = "OTPInput";

export { OTPInput };