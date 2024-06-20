import '../../style/signIn.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../input-field/InputField';
import LabelDisplay from '../input-field/LabelForFiled';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import GreenSbmtBtn from '../button/GreenSubmitBtn';
import SendUserInfo from '../../api/UserLoginApi';
import { generateNonce } from '../../generate-nonce/nonce';


const SignInPageRender = () => {
    const navigate = useNavigate()
    const location = useLocation();
    // Parse the URL and check if the success parameter is true
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success') === 'true';
    const [displayRegisterSuccessMsg, setDisplaySuccessRegisterMsg] = useState(true)
    const nonce = generateNonce()

    // Remove success message after 3 seconds
    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => {
                setDisplaySuccessRegisterMsg(false);
            }, 3000); // Set to false after 3 seconds
        }

        return () => clearTimeout(timer); // Cleanup the timer on unmount or when `pwdConfSuccessMsg` changes
    }, [success]);

    const DisplayRegistrationSuccessMsg = () => {
        const successMsgStyle = {
            color: 'white',
            backgroundColor: 'green',
            width: '600px',
            padding: '10px',
            marginRight: 'auto',
            marginLeft: 'auto'
        }
        return <div className="text-center">
            <p style={successMsgStyle} nonce={nonce}>Utilisateur crée avec success. Veuillez vous connecter !</p>
        </div>
    }
    // Monitor login Error, initial state of loginErrorMsg.length is false
    const [loginErrorMsg, setLoginErrorMsg] = useState('')
    // Handle login Sucess message if no erros. This uses the length of loginErrorMsg
    const DisplayLoginErrorMsg = ({ loginErrorMsgHandler }) => {
        const loginErrorMsgStyle = {
            color: 'white',
            backgroundColor: 'red',
            width: '600px',
            padding: '10px',
            marginRight: 'auto',
            marginLeft: 'auto'
        }
        const LoginErrorField = () => {
            return <div className='text-center ' style={loginErrorMsgStyle} nonce={nonce}>
                <p>{loginErrorMsgHandler}</p>
            </div>
        }
        // Initially the length of loginErrorMsg is 0 so false
        if (loginErrorMsgHandler.length) {
            return <LoginErrorField />
        }
        return '';
    }
    const SignInInputBox = () => {
        const [email, setEmail] = useStoreValueInputedInField()
        const [pwd, setPwd] = useStoreValueInputedInField()

        // Function to authenticate user and obtain tokens
        const loginUser = async (credentials) => {
            // Post to route and Check token from api/UserLoginApi 
            const check = await SendUserInfo(credentials);
            console.log(check);
            return check;
        };


        const login = async (e) => {
            e.preventDefault();
            try {
                const credentials = {
                    email: email,
                    password: pwd,
                };
                setLoginErrorMsg('');
                const token = await loginUser(credentials); // No need to destructure
                console.log('Access token:', token);
                navigate('/accueil')
                // Store tokens in local storage or cookies, etc.
            } catch (error) {
                // Display the Login Error message if an error is caught
                setLoginErrorMsg('Email ou mot de passe incorrect!')
                // Handle login errors
                console.error('Login failed:', error);
            }
        };
        return <div className='container fade-in-down-big'>
            <div className="pt-3 mb-5">
                {success && displayRegisterSuccessMsg && <DisplayRegistrationSuccessMsg />}
            </div>
            <div className='registration-field-container'>
                <div className='mb-3 text-center'>
                    <p className='sign-in-form-title-text'>Se Connecter</p>
                </div>
                <form onSubmit={login}>
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
                        <div className='input-filed-container mb-5'>
                            <InputField
                                typeHandler='password'
                                nameHandler='pwd-field'
                                idHandler='pwd-field'
                                placeholderHandler='Entrer un mot de passe...'
                                valueHandler={pwd}
                                setValueHandler={setPwd}
                            />
                        </div>
                    </div>
                    <div className='option-create-acc-upper-container'>
                        <Link className='creat-acc-option' to='/inscription'>Créer un compte ?</Link>
                    </div>
                    <GreenSbmtBtn value='Valider' />
                </form>
            </div>
        </div>
    }

    const [signInBgrd, setSignInBgrd] = useState(false);
    useEffect(() => {
        setSignInBgrd(location.pathname === "/connexion" || location.pathname === "/connexion/");
    }, [location]);

    return <>
        <main className="sign-in-main-body">
            <div className={signInBgrd ? "sign-in-background animated-bg" : "animated-bg"}>
                < DisplayLoginErrorMsg loginErrorMsgHandler={loginErrorMsg} />
                <div className='container'>
                    <div className='return-icon-and-text-container'>
                    </div>
                </div>
                <div className='sign-in-section-container'>
                    <SignInInputBox />
                </div>
            </div>
        </main>
    </>
}

export default SignInPageRender;