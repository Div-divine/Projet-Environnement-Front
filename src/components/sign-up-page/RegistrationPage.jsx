import '../../style/signUp.css';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import InputField from '../input-field/InputField';
import LabelDisplay from '../input-field/LabelForFiled';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import GreenSbmtBtn from '../button/GreenSubmitBtn.jsx';
import useToggle from '../../custom-hooks/HookToToggle';
import backwardIcon from '../../assets/svg/backward-solid.svg';
import Axios from 'axios';
import FirstMenu from '../Menus/FirstPageMenu.jsx';

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
const DisplayPasswordStrength = ({ strength, password, text }) => {
    const pwdStateText = { color: 'white' }
    const style = password.length >= 8 ? { color: 'green' } : { color: 'red' }
    if (password.length > 0) {
        return <p><span style={pwdStateText}>Mot de passe : </span><strong style={style}>{strength}</strong></p>
    }
    return <p className='pwd-rule-text'>{text}</p>
}


const RegistrationInputBox = () => {
    const [ruleText, setRuleText] = useState('Minimum 8 charactères contenant un majuscule, un chiffre et un symbole')
    const [checked, setChecked] = useToggle()
    const [name, setName] = useStoreValueInputedInField();
    const [email, setEmail] = useStoreValueInputedInField();
    const [pwd, setPwd] = useStoreValueInputedInField();
    const [pwdConf, setPwdConf] = useStoreValueInputedInField();
    const [pwdConfError, setPwdConfError] = useState('');
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [pwdErrorMsg, setPwdErrorMsg] = useState('');
    const [pwdRuleError, setPwdRuleError] = useState('');
    const [conditionStyle, setConditionStyle] = useState({color: 'white'});

    // Assign pattern to password
    const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const invalidPwd = { color: 'red' }
    const handleStrength = useMemo(
        () => {
            // Get rid of the error messages once the input fields are filled
            if (pwd.length > 1) {
                setPwdErrorMsg('');
            }
            if (pwdConf == pwd) {
                setPwdConfError('')
            }
            if (name.length > 0) {
                setNameErrorMsg('')
            }
            if (email.length > 1) {
                setEmailErrorMsg('')
            }
            if (pwdPattern.test(pwd)) {
                setPwdRuleError('');
            }
            // Reset the checkbox to accept users terms and condition once it is checked
            if(checked === true){
                setConditionStyle({color: 'white'}) 
            }

            // Display Password strength message
            if (pwd.length <= 3) {
                return "Trés Faible"
            }
            if (pwd.length < 8) {
                return "Faible"
            }
            if (!pwdPattern.test(pwd) && pwd.length >= 8) {
                return <span style={invalidPwd}>Invalide</span>
            }
            if (pwdPattern.test(pwd) && pwd.length >= 8) {
                return "Super :)"
            }
        }, [pwd]);

    const registrationFormData = {
        username: name, // Assuming 'name' corresponds to the username input field
        email: email,
        password: pwd
    };
    const location = useLocation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Once the form is submitted remove the password yellow rule to give way to the red error password rule message
        setRuleText('');
        console.log(checked)
        try {
            if (pwdConf !== pwd || name.length < 1 || email.length < 1 || pwd.length < 1 || !pwdPattern.test(pwd) || !checked ) {
                if (pwdConf != pwd) {
                    setPwdConfError('Confirmation mot de passe incorrect')
                }
                if (name.length < 1) {
                    setNameErrorMsg('Saissisez un nom')
                }
                if (email.length < 1) {
                    setEmailErrorMsg('Saississer un email')
                }
                if (pwd.length < 1) {
                    setPwdErrorMsg('Entrer un mot de passe')
                }
                if (!pwdPattern.test(pwd)) {
                    setPwdRuleError('Minimum 8 charactères contenant un majuscule, un chiffre et un symbole');
                }
                if(!checked){
                   setConditionStyle({color: 'red'}) 
                }
                return false;
            }
            console.log(registrationFormData);
            await Axios.post('http://localhost:3000/users/', registrationFormData);
            console.log('User created successfully');
            // Redirect to the welcome page after form submission
            window.location.href = '/welcome';
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };
    return <div className='container'>
        <div className='registration-field-container'>
            <div className='mb-3 text-center'>
                <p className='registeration-form-title-text'>Inscription</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='input-and-label-container'>
                    <div className='mb-3 mt-5 input-label-container'>
                        <LabelDisplay labelHandler='name-field' labelText='Nom' />
                    </div>
                    <div className='input-filed-container mb-2'>
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
                <div className='input-filed-container mb-3'>
                    <p style={{ color: 'red' }}>{nameErrorMsg}</p>
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
                <div className='input-filed-container mb-3'>
                    <p style={{ color: 'red' }}>{emailErrorMsg}</p>
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
                        <DisplayPasswordStrength strength={handleStrength} password={pwd} text={ruleText}/>
                    </div>
                </div>
                <div className='input-filed-container mb-3'>
                    <p style={{ color: 'red', fontSize: 'small' }}>{pwdRuleError}</p>
                </div>
                <div className='input-filed-container mb-3'>
                    <p style={{ color: 'red' }}>{pwdErrorMsg}</p>
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
                            placeholderHandler='Résaisissez votre mot de passe...'
                            valueHandler={pwdConf}
                            setValueHandler={setPwdConf}
                        />
                    </div>
                </div>
                <div className='input-filed-container mb-3'>
                    <p style={{ color: 'red' }}>{pwdConfError}</p>
                </div>
                <div className='mb-5 ckeckbox-with-label-container'>
                    <div>
                        <span className='checkbox-container-margin'>
                            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} name='checkbox' id='checkbox' />
                        </span>
                        <LabelDisplay labelHandler='checkbox' labelText="Accepter les conditions d'utilisation" labelStyle= {conditionStyle} />
                    </div>
                </div>

                <GreenSbmtBtn value='Enregistrer' />
            </form>
        </div>
    </div>
}

const SignUpPageRender = () => {

    // The useLocation in react-router-dom detects our current url
    const location = useLocation();
    const [isRegister, setIsRegister] = useState(false);

    // 
    useEffect(() => {
        // SetIsRegister to the current url
        setIsRegister(location.pathname === "/inscription" || location.pathname === "/inscription/");
    }, [location]);

    return <>
        <div>
            <FirstMenu />
        </div>
        <main className="registration-main-body">
            {/* set background image if in the current url */}
            <div className={isRegister ? "register-background animated-bg" : "animated-bg"}>
                <div className='container'>
                    <div className='return-icon-and-text-container'>
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