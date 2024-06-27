import '../../style/signUp.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../input-field/InputField';
import LabelDisplay from '../input-field/LabelForFiled';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import GreenSbmtBtn from '../button/GreenSubmitBtn.jsx';
import PostUserInfo from '../../api/UserRegistrationApi.jsx';
import { generateNonce } from '../../generate-nonce/nonce.js';

const nonce = generateNonce();

const DisplayPasswordStrength = ({ strength, password, text }) => {
    const pwdStateText = { color: 'white', nonce };
    const style = password.length >= 8 ? { color: 'green' } : { color: 'red' };

    if (password.length > 0) {
        return (
            <p>
                <span style={pwdStateText} nonce={nonce}>Mot de passe : </span>
                <strong style={style} nonce={nonce}>{strength}</strong>
            </p>
        );
    }
    return <p className='pwd-rule-text'>{text}</p>;
};

const RegistrationInputBox = () => {
    const navigate = useNavigate();
    const [ruleText, setRuleText] = useState('Minimum 8 charactères contenant un majuscule, un chiffre et un symbole');
    const [checked, setChecked] = useState(false);
    const [name, setName] = useStoreValueInputedInField();
    const [email, setEmail] = useStoreValueInputedInField();
    const [pwd, setPwd] = useStoreValueInputedInField();
    const [pwdConf, setPwdConf] = useStoreValueInputedInField();
    const [pwdConfError, setPwdConfError] = useState('');
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [pwdErrorMsg, setPwdErrorMsg] = useState('');
    const [pwdRuleError, setPwdRuleError] = useState('');
    const [conditionStyle, setConditionStyle] = useState({});
    const [registrationError, setRegistrationError] = useState(null);

    const emailPattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
    const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleStrength = (password) => {
        if (password.length <= 3) {
            return "Trés Faible ";
        }
        if (password.length < 8) {
            return "Faible";
        }
        if (!pwdPattern.test(password) && password.length >= 8) {
            return <span className='input-error-msg'>Non Valide</span>;
        }
        if (pwdPattern.test(password) && password.length >= 8) {
            return "Super 😊";
        }
        return "";
    };

    const nameWithoutSpacialChar = name.replace(/[^\w\s]/gi, '').trim();

    const registrationFormData = {
        username: nameWithoutSpacialChar,
        email: email,
        password: pwd
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRuleText('');

        if (pwdConf !== pwd || nameWithoutSpacialChar.length < 1 || email.length < 1 || pwd.length < 1 || !pwdPattern.test(pwd)) {
            if (pwdConf !== pwd) {
                setPwdConfError('Confirmation mot de passe incorrect');
            }
            if (nameWithoutSpacialChar.length < 1) {
                setNameErrorMsg('Saissisez un nom');
            }
            if (email.length < 1) {
                setEmailErrorMsg('Saississer un email');
            }
            if (!emailPattern.test(email) && email.length > 1) {
                setEmailErrorMsg('Saississez un email valide');
            }
            if (pwd.length < 1) {
                setPwdErrorMsg('Entrer un mot de passe');
            }
            if (!pwdPattern.test(pwd)) {
                setPwdRuleError('Minimum 8 charactères contenant un majuscule, un chiffre et un symbole');
            }
            return;
        }

        if (!checked) {
            setConditionStyle({ color: 'red' });
            return;
        }

        try {
            await PostUserInfo(registrationFormData);
            navigate('/connexion?success=true');
        } catch (error) {
            if (error.response) {
                setRegistrationError(error.response.data.message);
            } else {
                setRegistrationError('Network error');
            }
        }
    };

    const DisplayRegistrationErrorMsg = ({ loginErrorMsgHandler }) => {
        const registrationErrorMsgStyle = {
            color: 'white',
            backgroundColor: 'red',
            width: '600px',
            padding: '10px',
            marginRight: 'auto',
            marginLeft: 'auto'
        };

        return (
            <div className='text-center mb-5' style={registrationErrorMsgStyle} nonce={nonce}>
                <p>{loginErrorMsgHandler}</p>
            </div>
        );
    };

    return (
        <div className='container fade-in-down-big'>
            {registrationError && <DisplayRegistrationErrorMsg loginErrorMsgHandler={registrationError} />}
            <div className='registration-field-container'>
                <div className='text-center'>
                    <p className='registeration-form-title-text'>Inscription</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='input-and-label-container'>
                        <div className='mb-3 mt-3 input-label-container'>
                            <LabelDisplay labelHandler='name-field' labelText='Pseudo' />
                        </div>
                        <div className='input-filed-container mb-2'>
                            <InputField
                                typeHandler='text'
                                nameHandler='name-field'
                                idHandler='name-field'
                                placeholderHandler='Saisir votre Pseudo...'
                                valueHandler={name}
                                setValueHandler={setName}
                            />
                        </div>
                    </div>
                    <div className='input-filed-container mb-3'>
                        <p className='input-error-msg'>{nameErrorMsg}</p>
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
                                placeholderHandler='Saisir votre adresse mail...'
                                valueHandler={email}
                                setValueHandler={setEmail}
                            />
                        </div>
                    </div>
                    <div className='input-filed-container mb-3'>
                        <p className='input-error-msg'>{emailErrorMsg}</p>
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
                                placeholderHandler='Saisir un mot de passe...'
                                valueHandler={pwd}
                                setValueHandler={setPwd}
                            />
                        </div>
                        <div className='pwd-rule-text-container'>
                            <DisplayPasswordStrength strength={handleStrength(pwd)} password={pwd} text={ruleText} />
                        </div>
                    </div>
                    <div className='input-filed-container mb-3'>
                        <p style={{ color: 'red', fontSize: 'small' }} nonce={nonce}>{pwdRuleError}</p>
                    </div>
                    <div className='input-filed-container'>
                        <p className='input-error-msg'>{pwdErrorMsg}</p>
                    </div>
                    <div className='input-and-label-container'>
                        <div className='mb-3 input-label-container'>
                            <LabelDisplay labelHandler='pwdconf-field' labelText='Confirmer votre mot de passe' />
                        </div>
                        <div className='input-filed-container mb-2'>
                            <InputField
                                typeHandler='password'
                                nameHandler='pwdconf-field'
                                idHandler='pwdconf-field'
                                placeholderHandler='Saisir une fois encore votre mot de passe...'
                                valueHandler={pwdConf}
                                setValueHandler={setPwdConf}
                            />
                        </div>
                    </div>
                    <div className='input-filed-container mb-3'>
                        <p className='input-error-msg'>{pwdConfError}</p>
                    </div>
                    <div className='mb-5 ckeckbox-with-label-container'>
                        <div>
                            <span className='checkbox-container-margin'>
                                <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} name='checkbox' id='checkbox' />
                            </span>
                            <LabelDisplay labelHandler='checkbox' labelText="Accepter le RGPD et les conditions d'utilisation"
                                labelStyle={checked ? {color: 'white'} : {color: '#FFA500'}} nonce={nonce} />
                        </div>
                    </div>
                    <GreenSbmtBtn value="M'Inscrire👍" />
                </form>
            </div>
        </div>
    );
};

const SignUpPageRender = () => {
    const location = useLocation();
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        setIsRegister(location.pathname === "/inscription" || location.pathname === "/inscription/");
    }, [location]);

    return (
        <main className="registration-main-body">
            <div className={isRegister ? "register-background animated-bg" : "animated-bg"}>
                <div className='registration-section-container'>
                    <RegistrationInputBox />
                </div>
            </div>
        </main>
    );
};

export default SignUpPageRender;
