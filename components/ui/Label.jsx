export const Label = ({ className, children, htmlFor, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-medium text-gray-400 mb-1 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </label>
  );
};
