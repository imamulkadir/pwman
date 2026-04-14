export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className="card-apple max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto"
          role="dialog"
        >
          {typeof children === "function"
            ? children({ onOpenChange })
            : children}
        </div>
      </div>
    </>
  );
};

export const DialogTrigger = ({ asChild, children, onClick, ...props }) => {
  return asChild ? (
    <div onClick={onClick} {...props}>
      {children}
    </div>
  ) : (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export const DialogContent = ({
  className,
  children,
  onOpenChange,
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className || ""}`} {...props}>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export const DialogHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={`p-6 border-b border-gray-700/50 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const DialogTitle = ({ className, children, ...props }) => {
  return (
    <h2
      className={`text-lg font-semibold text-gray-100 ${className || ""}`}
      {...props}
    >
      {children}
    </h2>
  );
};

export const DialogDescription = ({ className, children, ...props }) => {
  return (
    <p className={`text-sm text-gray-400 ${className || ""}`} {...props}>
      {children}
    </p>
  );
};

export const DialogBody = ({ className, children, ...props }) => {
  return (
    <div className={`p-6 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export const DialogFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={`p-6 border-t border-gray-700/50 flex gap-3 justify-end ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};
