import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { generateNonce } from "../../generate-nonce/nonce";
import '../../style/PopOverStyle.css'

const Popover = ({ content, children }) => {
  const nonce = generateNonce()
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      nonce={nonce}
      className="small-popover"
    >
      <div>{children}</div>
      {isHovered && (
        <motion.div className="popover-for-texts-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          nonce={nonce}
        > <div className="popover-content-container">
            {content}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Popover;
