import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion components

const Popup = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling when the popup is open
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling when the popup is closed
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent closing when clicking inside the modal content
            onClose(); // Close the popup
          }}
        >
          <motion.div
            className="bg-accent p-6 rounded-lg shadow-lg text-center"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;