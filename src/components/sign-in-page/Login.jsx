import '../../style/signIn.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../input-field/InputField';
import LabelDisplay from '../input-field/LabelForFiled';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import GreenSbmtBtn from '../button/GreenSubmitBtn';
import SendUserInfo from '../../api/UserLoginApi';
import { generateNonce } from '../../generate-nonce/nonce';
import CustomModal from '../modalbox/CustomModalBox'
import retrieveEncryptedAdminToken from '../../functions/GetAdminToken';


const SignInPageRender = () => {
    const navigate = useNavigate()
    const location = useLocation();
    // Parse the URL and check if the success parameter is true
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success') === 'true';
    const [displayRegisterSuccessMsg, setDisplaySuccessRegisterMsg] = useState(true)
    const nonce = generateNonce()
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        return <div className="text-center">
            <p className='registration-successs-msg'>Utilisateur crée avec success. Veuillez vous connecter !</p>
        </div>
    }
    // Monitor login Error, initial state of loginErrorMsg.length is false
    const [loginErrorMsg, setLoginErrorMsg] = useState('')
    // Handle login Sucess message if no erros. This uses the length of loginErrorMsg
    const DisplayLoginErrorMsg = ({ loginErrorMsgHandler }) => {

        const LoginErrorField = () => {
            return <div className='text-center login-error-msg' >
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

        const login = async (e) => {
            e.preventDefault();
            try {
                if (email && pwd) {
                    const credentials = {
                        email: email,
                        password: pwd,
                    };
                    const token = await SendUserInfo(credentials);
                    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();
                    if (token && decryptedToken) {
                        navigate('/accueil')
                    }
                }
                // Store tokens in local storage
            } catch (error) {
                setIsModalOpen(true)
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
                                placeholderHandler='saisir votre adresse mail...'
                                valueHandler={email}
                                setValueHandler={setEmail}
                            />
                        </div>
                    </div>
                    <div className='input-and-label-container'>
                        <div className='mb-3 input-label-container'>
                            <LabelDisplay labelHandler='pwd-field' labelText='Mot de passe' />
                        </div>
                        <div className='input-filed-container mb-3'>
                            <InputField
                                typeHandler='password'
                                nameHandler='pwd-field'
                                idHandler='pwd-field'
                                placeholderHandler='Saisir votre mot de passe...'
                                valueHandler={pwd}
                                setValueHandler={setPwd}
                            />
                        </div>
                    </div>
                    <GreenSbmtBtn value='Valider' />
                    <div className='or-text'>
                        <div className='yellow-line'></div>
                        <div className='text-center'>Ou</div>
                        <div className='yellow-line'></div>
                    </div>
                    <div className='option-create-acc-upper-container text-center'>
                        <Link className='creat-acc-option' to='/inscription'>Créer un compte</Link>
                    </div>
                </form>
            </div>
        </div>
    }

    const [signInBgrd, setSignInBgrd] = useState(false);
    useEffect(() => {
        setSignInBgrd(location.pathname === "/connexion" || location.pathname === "/connexion/");
    }, [location]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return <div className='sign-in-main-container'>
        <main className="sign-in-main-body">
            <div className={signInBgrd ? "sign-in-background animated-bg" : "animated-bg"}>
                <div className='sign-in-section-container'>
                    <SignInInputBox />
                </div>
            </div>
        </main>
        {isModalOpen && (
            <CustomModal
                title="Erreur lors de la connexion"
                message="Email ou mot de passe incorrect!"
                buttonText="Supprimer"
                onClose={handleCloseModal}
            />
        )}
    </div>
}

export default SignInPageRender;