import { useEffect, useState } from "react";

export function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 300); // Animation duration
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!isVisible || !message) return null;

  const typeStyles = {
    success: "bg-green-50/90 border-green-200/50 text-green-700",
    error: "bg-red-50/90 border-red-200/50 text-red-700",
    warning: "bg-yellow-50/90 border-yellow-200/50 text-yellow-700",
    info: "bg-blue-50/90 border-blue-200/50 text-blue-700",
  };

  return (
    <div
        className={`max-w-sm p-4 rounded-xl border backdrop-blur-sm shadow-lg transition-all duration-300 ${
          typeStyles[type]
        } ${
          isExiting
            ? "opacity-0 transform translate-x-full"
            : "opacity-100 transform translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose?.();
              }, 300);
            }}
            className="flex-shrink-0 w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
  );
}

export function ToastContainer({ toasts, onRemoveToast }) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemoveToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}
