import React from "react";

export const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-gray-900 rounded-lg border border-gray-700 shadow-sm ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={`p-6 border-b border-gray-700 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h2
      className={`text-lg font-semibold text-gray-100 ${className || ""}`}
      {...props}
    >
      {children}
    </h2>
  );
};

export const CardDescription = ({ className, children, ...props }) => {
  return (
    <p className={`text-sm text-gray-400 ${className || ""}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={`p-6 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={`p-6 border-t border-gray-700 flex gap-3 justify-end ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
};
