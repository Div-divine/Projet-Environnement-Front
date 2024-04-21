import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Popover = ({ content, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverHovered, setIsPopoverHovered] = useState(false);

  useEffect(() => {
    if (!isHovered && !isPopoverHovered) {
      const timeoutId = setTimeout(() => {
        setIsHovered(false);
      }, 200); // Adjust the delay as needed
      return () => clearTimeout(timeoutId);
    }
  }, [isHovered, isPopoverHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePopoverMouseEnter = () => {
    setIsPopoverHovered(true);
  };

  const handlePopoverMouseLeave = () => {
    setIsPopoverHovered(false);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>{children}</div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            bottom: "70%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "0.5rem",
            borderRadius: "4px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        > <div style={{width: '300px'}}>
            {content}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Popover;
