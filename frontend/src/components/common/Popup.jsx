import { useEffect } from "react";

const Popup = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex px-6 items-center justify-center bg-black bg-opacity-50 z-10000"
      onClick={(e) => {
        e.stopPropagation(); // Stop sidebar from opening
        onClose();
      }}  // Close when clicking outside
    >
      <div
        className="bg-[#121213] p-6 rounded-lg shadow-lg text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;