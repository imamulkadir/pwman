import React from "react";

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
      default: "btn-apple",
      outline:
        "border border-gray-300 bg-white/80 text-gray-900 hover:bg-gray-50/80 focus:ring-gray-500 backdrop-blur-sm",
      secondary:
        "bg-gray-100/80 text-gray-900 hover:bg-gray-200/80 focus:ring-gray-400 backdrop-blur-sm",
      destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
      ghost: "hover:bg-gray-100/80 text-gray-900 focus:ring-gray-400",
    };

    const sizes = {
      default: "px-4 py-2.5 text-sm",
      sm: "px-3 py-2 text-xs",
      lg: "px-6 py-3 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
          className || ""
        }`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
