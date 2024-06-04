import React, { useState } from 'react';
import '../../style/CustomModal.css';
import GreenSbmtBtn from '../button/GreenSubmitBtn';
import LabelDisplay from '../input-field/LabelForFiled';
import InputField from '../input-field/InputField';
import { Link } from 'react-router-dom';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';

const CustomPwdUpdateModal = ({ title, message, onClose, onformSubmit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPwd, setCurrentPwd] = useStoreValueInputedInField();
  const [newPwd, setNewPwd] = useStoreValueInputedInField();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const submitUpdatePwd = (e) => {
    e.preventDefault();
    onformSubmit();
    setIsOpen(false);
  };

  return (
    <div className={`custom-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={handleClose} className='modal-close-btn'>Retour</button>
        </div>
        <div className="modal-body">
          <div>{message}</div>
        </div>
        <div className="modal-footer">
          <form onSubmit={(e) =>submitUpdatePwd(e)}>
                    <div className='input-and-label-container'>
                        <div className='mb-3 input-label-container'>
                            <LabelDisplay labelHandler='pwd-conf-field' labelText='Entrer votre mot de passe actuel' labelStyle={{color: '#0940119d',fontWeight : '700'}}/>
                        </div>
                        <div className='input-filed-container mb-3'>
                            <InputField
                                typeHandler='password'
                                nameHandler='pwd-conf-field'
                                idHandler='pwdConf-field'
                                placeholderHandler='Entrer le mot de passe...'
                                valueHandler={currentPwd}
                                setValueHandler={setCurrentPwd}
                            />
                        </div>
                    </div>
                    <div className='input-and-label-container'>
                        <div className='mb-3 input-label-container'>
                            <LabelDisplay labelHandler='new-pwd-field' labelText='Nouveau mot de passe' labelStyle={{color: '#0940119d',fontWeight : '700'}}/>
                        </div>
                        <div className='input-filed-container mb-5'>
                            <InputField
                                typeHandler='password'
                                nameHandler='new-pwd-field'
                                idHandler='newPwd-field'
                                placeholderHandler='Entrer votre nouveau mot de passe...'
                                valueHandler={newPwd}
                                setValueHandler={setNewPwd}
                            />
                        </div>
                    </div>
                    <div className='option-create-acc-upper-container'>
                        <Link className='creat-acc-option' to='/inscription'>Mot de passe oublié ?</Link>
                    </div>
                    <GreenSbmtBtn value='Valider' />
                </form>
        </div>
      </div>
    </div>
  );
};

export default CustomPwdUpdateModal;
