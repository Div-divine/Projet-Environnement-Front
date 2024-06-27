import React, { useState } from 'react';
import '../../style/CustomModal.css';

const CustomModal = ({ title, message, buttonText, onClose, onButtonClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleButtonClick = () => {
    onButtonClick();
    setIsOpen(false);
  };
  
  return (
    <div className={`custom-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <div className='text-center'>{message}</div>
        </div>
        <div className="modal-footer">
          <button onClick={handleButtonClick} className='modal-delete-btn'>{buttonText}</button>
          <button onClick={handleClose} className='modal-close-btn'>Retour</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
