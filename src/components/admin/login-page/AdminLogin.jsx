import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../../style/admin-login-page.css';
import InputField from "../../input-field/InputField";
import LabelDisplay from "../../input-field/LabelForFiled";
import useStoreValueInputedInField from "../../../custom-hooks/HookFormInputController";
import GreenSbmtBtn from "../../button/GreenSubmitBtn";
import { generateNonce } from '../../../generate-nonce/nonce';
import SendAdminInfo from '../../../api/AdminLoginApi';


const AdminSignInPageRender = () => {
    const navigate = useNavigate()
    const nonce = generateNonce()

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
                    setLoginErrorMsg('');
                    const token = await SendAdminInfo(credentials);
                    if (token) {
                        console.log('Admin Token from login page:', token)
                        navigate('/admin/accueil');
                    }
                }
            } catch (error) {
                if (error.response.status == 401) {
                    // Display unauthorized access Login Error message if an error is caught
                    setLoginErrorMsg('Accèss non authorisé!')
                }
                if (error.response.status == 404) {
                    // Display the Login Error message if an error is caught
                    setLoginErrorMsg('Email ou mot de passe incorrect!')
                }
                // Handle login errors
                console.error('Login failed:', error);
            }
        };
        return <div className='container fade-in-down-big'>
            <div className='registration-field-container admin-login-container'>
                <div className='text-center'>
                    <p className='sign-in-form-title-text'>Connexion Admin</p>
                </div>
                <form onSubmit={login}>
                    <div className='input-and-label-container'>
                        <div className='input-label-container'>
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
                        <div className='input-label-container'>
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
                    <GreenSbmtBtn value='Se connecter' />
                </form>
            </div>
        </div>
    }

    return <>
        <main className="admin-login-main flex-center">
            <div className="">
                < DisplayLoginErrorMsg loginErrorMsgHandler={loginErrorMsg} />
                <div className='sign-in-section-container'>
                    <SignInInputBox />
                </div>
            </div>
        </main>
    </>
}

export default AdminSignInPageRender;