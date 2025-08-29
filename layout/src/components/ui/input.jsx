import * as React from "react";
import { cn } from "../../lib/utils";
import { Eye, EyeOff } from "lucide-react"; 

const Input = React.forwardRef(({ className, type, placeholder, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  // Determine actual input type
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="input-container w-full relative">
      {placeholder && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {placeholder}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          data-slot="input"
          className={cn(
            "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-[#404040] px-3 py-3 text-base shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm leading-tight",
            "focus-visible:border-yellow-500 focus-visible:ring-yellow-500/50 focus-visible:ring-[3px] focus-visible:bg-[#2a2a2a]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            error ? "border-destructive" : "",
            type === "password" ? "pr-10" : "", // add right padding for icon
            className
          )}
          {...props}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300"
            tabIndex={-1} // prevent focusing button on tab
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="input-error mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };