import React, { useEffect } from "react";
import { X } from "lucide-react";

type AppModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
};

const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title = "Confirmation",
  children,
  loading = false,
  className = "",
}) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center px-4">
      <div
        className={
          "bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 relative transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto" +
          (className ? " " + className : "")
        }
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full border-4 border-green-600 border-t-transparent w-8 h-8" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default AppModal;
