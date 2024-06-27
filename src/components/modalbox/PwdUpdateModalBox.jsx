import React, { useState, useEffect } from 'react';
import '../../style/CustomModal.css';
import GreenSbmtBtn from '../button/GreenSubmitBtn';
import LabelDisplay from '../input-field/LabelForFiled';
import InputField from '../input-field/InputField';
import { Link, useNavigate } from 'react-router-dom';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import useUserData from '../../api/UserInfoApi';
import updateUserPwd from '../../api/UpdateUserPwdApi';
import { generateNonce } from '../../generate-nonce/nonce';
import { useCsrf } from '../../context/CsrfContext';

const CustomPwdUpdateModal = ({ title, message, onClose }) => {
  const csrfToken = useCsrf()
  const nonce = generateNonce()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true);
  const [currentPwd, setCurrentPwd] = useStoreValueInputedInField();
  const [newPwd, setNewPwd] = useStoreValueInputedInField();
  const [userId, setUserId] = useState(null);
  const initialUserData = useUserData();
  const [updatePwdErrorMsg, setUpdatePwdErrorMsg] = useState('');
  const [displayUpdatePwdErrorMsg, setDisplayUpdatePwdErrorMsg] = useState(false)
  const [wrongPwdConfMsg, setWrongPwdConfMsg] = useState('')
  const [catchErrorMsg, setCatchErrorMsg] = useState(false)

  useEffect(() => {
    if (initialUserData) {
      setUserId(initialUserData.user_id)
    }
  }, [initialUserData]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const submitUpdatePwd = async (e, user, confPwd, newPwd, csrf) => {
    e.preventDefault();
    try {
      if (user) {
        const data = {
          confPwd,
          newPwd
        }

        // Assign pattern to password
        const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Test password to see if valid (returns boolean)
        const isValidPwd = pwdPattern.test(newPwd);

        const removeSpaceConfPwd = confPwd.replace(/\s+/g, '').trim()
        const removeSpaceNewPwd = newPwd.replace(/\s+/g, '').trim()

        if (!removeSpaceConfPwd.length > 0) {
          setUpdatePwdErrorMsg('Saisir votre mot de passe avant de le changer!')
          setDisplayUpdatePwdErrorMsg(true)
        }
        if (!removeSpaceNewPwd.length > 0) {
          setUpdatePwdErrorMsg('Entrer le nouveau mot de passe!')
          setDisplayUpdatePwdErrorMsg(true)
        }
        if (!isValidPwd) {
          setUpdatePwdErrorMsg('Minimum 8 charactères contenant un majuscule, un chiffre et un symbole!')
          setDisplayUpdatePwdErrorMsg(true)
        }
        if(!csrf){
          console.log('No csrf token')
          return;
        }

        await updateUserPwd(user, data, csrf)
        onClose();
        // Set url to display update password success message
        navigate('/parametre?pwd-conf=true')

      }
    } catch (error) {
      console.error('Error handling user password update:', error.message);
      const removeSpaceConfPwd = confPwd.replace(/\s+/g, '').trim()
      if (removeSpaceConfPwd.length > 0) {
        setWrongPwdConfMsg('Confirmation de mot de passe incorrect!')
        setCatchErrorMsg(true)
      }
    }

  };

  return (
    < div className={`custom-modal ${isOpen ? 'open' : ''}`}>
      {userId && <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={handleClose} className='modal-close-btn'>Retour</button>
        </div>
        <div className="modal-body">
          <div>{message}</div>
        </div>
        <div className="modal-footer">
          {csrfToken && <form onSubmit={(e) => submitUpdatePwd(e, userId, currentPwd, newPwd, csrfToken)}>
            <div className='input-and-label-container'>
              {displayUpdatePwdErrorMsg && updatePwdErrorMsg && <div className='email-error'>{updatePwdErrorMsg}</div>}
              {catchErrorMsg && wrongPwdConfMsg && <div className='email-error'>{wrongPwdConfMsg}</div>}
              <div className='mb-3 input-label-container'>
                <LabelDisplay labelHandler='pwd-conf-field' labelText='Entrer votre mot de passe actuel' 
                className='pwd-update-label' />
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
                <LabelDisplay labelHandler='new-pwd-field' 
                className='pwd-update-label' labelText='Nouveau mot de passe'/>
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
            <div className='btn-sbmt-updayte-pwd'><GreenSbmtBtn value='Valider' /></div>
            <div className='option-create-acc-upper-container'>
              <Link className='creat-acc-option option-forgotten-pwd' >Mot de passe oublié ?</Link>
            </div>
          </form>}
        </div>
      </div>}
    </div >
  );
};

export default CustomPwdUpdateModal;
