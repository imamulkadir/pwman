import React from "react";

export const Input = React.forwardRef(
  ({ className, type = "text", disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        disabled={disabled}
        ref={ref}
        className={`input-apple w-full text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent disabled:bg-gray-800/50 disabled:cursor-not-allowed transition-all duration-200 ${
          className || ""
        }`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
