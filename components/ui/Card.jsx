export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={`p-6 border-b border-gray-200 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h2
      className={`text-lg font-semibold text-gray-900 ${className || ""}`}
      {...props}
    >
      {children}
    </h2>
  );
};

export const CardDescription = ({ className, children, ...props }) => {
  return (
    <p className={`text-sm text-gray-600 ${className || ""}`} {...props}>
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
      className={`p-6 border-t border-gray-200 flex gap-3 justify-end ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
};
