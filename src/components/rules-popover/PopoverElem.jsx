import { motion } from "framer-motion";
import closeIcon from '../../assets/close.svg';
import '../../style/PopoverElemStyle.css';
import { generateNonce } from "../../generate-nonce/nonce";

const RulesPopover = ({ isOpen, onClose, children }) => {

  const nonce = generateNonce()

  return (
    <motion.div className="rules-popover-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
      transition={{ duration: 0.2 }}
      style={{
        zIndex: isOpen ? 1 : -1,
      }}
      nonce={nonce}
    >
      <motion.div className="close-icon-upper-container">
        <div onClick={onClose} className="close-icon-container">
          <img src={closeIcon} alt="" />
        </div>
      </motion.div>
      {children}
    </motion.div>
  );
};

export default RulesPopover;

