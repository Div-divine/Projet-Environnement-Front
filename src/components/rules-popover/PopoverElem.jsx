import { motion } from "framer-motion";
import closeIcon from '../../assets/svg/close.svg';
import '../../style/PopoverElemStyle.css';

const RulesPopover = ({ isOpen, onClose, children }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          padding: '10px',
          borderRadius: '5px',
          zIndex: isOpen ? 1 : -1,
          width: '600px'
        }}
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

  