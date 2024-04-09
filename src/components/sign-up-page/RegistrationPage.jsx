import '../../style/signUp.css';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../input-field/InputField';
import LabelDisplay from '../input-field/LabelForFiled';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import GreenSbmtBtn from '../button/GreenSubmitBtn.jsx';
import useToggle from '../../custom-hooks/HookToToggle';
import backwardIcon from '../../assets/svg/backward-solid.svg'

const CheckBox = () => {
    const [checked, setChecked] = useToggle()

    return <div className='mb-5 ckeckbox-with-label-container'>
        <div>
            <span className='checkbox-container-margin'>
                <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} name='checkbox' id='checkbox' />
            </span>
            <LabelDisplay labelHandler='checkbox' labelText="Accepter les conditions d'utilisation" />
        </div>
    </div>
}
const RegistrationInputBox = () => {
    const [name, setName] = useStoreValueInputedInField()
    const [surname, setSurname] = useStoreValueInputedInField()
    const [email, setEmail] = useStoreValueInputedInField()
    const [pwd, setPwd] = useStoreValueInputedInField()
    const [pwdConf, setPwdConf] = useStoreValueInputedInField()
    return <div className='container'>
        <div className='registration-field-container'>
            <div className='mb-3 text-center'>
                <p className='registeration-form-title-text'>Inscription</p>
            </div>
            <form action="" method='post'>
                <div className='input-and-label-container'>
                    <div className='mb-3 mt-5 input-label-container'>
                        <LabelDisplay labelHandler='name-field' labelText='Nom' />
                    </div>
                    <div className='input-filed-container mb-3'>
                        <InputField
                            typeHandler='text'
                            nameHandler='name-field'
                            idHandler='name-field'
                            placeholderHandler='saisissez votre nom...'
                            valueHandler={name}
                            setValueHandler={setName}
                        />
                    </div>
                </div>
                <div className='input-and-label-container'>
                    <div className='mb-3 input-label-container'>
                        <LabelDisplay labelHandler='surname-field' labelText='Prénom' />
                    </div>
                    <div className='input-filed-container mb-3'>
                        <InputField
                            typeHandler='text'
                            nameHandler='surname-field'
                            idHandler='surname-field'
                            placeholderHandler='saisissez votre prénom...'
                            valueHandler={surname}
                            setValueHandler={setSurname}
                        />
                    </div>
                </div>
                <div className='input-and-label-container'>
                    <div className='mb-3 input-label-container'>
                        <LabelDisplay labelHandler='email-field' labelText='Email' />
                    </div>
                    <div className='input-filed-container mb-3'>
                        <InputField
                            typeHandler='email'
                            nameHandler='email-field'
                            idHandler='email-field'
                            placeholderHandler='saisissez votre adresse mail...'
                            valueHandler={email}
                            setValueHandler={setEmail}
                        />
                    </div>
                </div>
                <div className='input-and-label-container'>
                    <div className='mb-3 input-label-container'>
                        <LabelDisplay labelHandler='pwd-field' labelText='Mot de passe' />
                    </div>
                    <div className='input-filed-container mb-2'>
                        <InputField
                            typeHandler='password'
                            nameHandler='pwd-field'
                            idHandler='pwd-field'
                            placeholderHandler='Entrer un mot de passe...'
                            valueHandler={pwd}
                            setValueHandler={setPwd}
                        />
                    </div>
                    <div className='pwd-rule-text-container mb-3'>
                        <p className='pwd-rule-text'>Minimum 11 charactères contenant un majuscule, un chiffre et une symbole</p>
                    </div>
                </div>
                <div className='input-and-label-container'>
                    <div className='mb-3 input-label-container'>
                        <LabelDisplay labelHandler='pwdconf-field' labelText='Confirmer votre mot de passe' />
                    </div>
                    <div className='input-filed-container mb-3'>
                        <InputField
                            typeHandler='password'
                            nameHandler='pwdconf-field'
                            idHandler='pwdconf-field'
                            placeholderHandler='Résaisissez votre mot de passe...'
                            valueHandler={pwdConf}
                            setValueHandler={setPwdConf}
                        />
                    </div>
                </div>

                <CheckBox />

                <GreenSbmtBtn value='Enregistrer' />
            </form>
        </div>
    </div>
}

const SignUpPageRender = () => {

    const location = useLocation();
    const [isRegister, setIsRegister] = useState(false);
    useEffect(() => {
        setIsRegister(location.pathname === "/inscription" || location.pathname === "/inscription/");
    }, [location]);

    return <>
        <main className="registration-main-body">
            <div className={isRegister ? "register-background animated-bg" : "animated-bg"}>
                <div className='container'>
                    <div className='return-icon-and-text-container'>
                        <div className='backward-icon-container'>
                            <Link to='/'><img src={backwardIcon} alt="backwardicon" /></Link>
                        </div>
                        <div className='return-text-container'>
                            <Link to='/' className='return-text'>Retour</Link>
                        </div>
                    </div>
                </div>
                <div className='registration-section-container'>
                    <RegistrationInputBox />
                </div>
            </div>
        </main>
    </>
}

export default SignUpPageRender;