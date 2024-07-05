import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../../style/admin-login-page.css';
import InputField from "../../input-field/InputField";
import LabelDisplay from "../../input-field/LabelForFiled";
import useStoreValueInputedInField from "../../../custom-hooks/HookFormInputController";
import GreenSbmtBtn from "../../button/GreenSubmitBtn";
import SendAdminInfo from '../../../api/AdminLoginApi';
import { useAdminAuth } from '../../../api/AdminAuthentificationApi';

const AdminSignInPageRender = () => {
    const navigate = useNavigate();
    const [loginErrorMsg, setLoginErrorMsg] = useState('');
    const [email, setEmail] = useStoreValueInputedInField();
    const [pwd, setPwd] = useStoreValueInputedInField();
    const [adminToken, setAdminToken] = useState(null)
    const { isAuthenticated } = useAdminAuth();

    console.log('Admin Auth state:', isAuthenticated)

    const login = async (e) => {
        e.preventDefault();
        try {
            if (email && pwd) {
                const credentials = { email, password: pwd };
                setLoginErrorMsg('');
                const token = await SendAdminInfo(credentials);
                if (token) {
                    setAdminToken(token)
                    console.log('Admin Token from login page:', token);
                } else {
                    console.error('Token is null or undefined');
                }
            } else {
                setLoginErrorMsg('Email and password are required');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setLoginErrorMsg('Accès non autorisé!');
            } else if (error.response?.status === 404) {
                setLoginErrorMsg('Email ou mot de passe incorrect!');
            } else {
                setLoginErrorMsg('An unexpected error occurred');
            }
            console.error('Login failed:', error);
        }
    };

    useEffect(()=>{
        if(adminToken && isAuthenticated){
            console.log('Admin Auth state:', isAuthenticated)
            navigate('/admin/accueil'); // Redirect to admin dashboard upon successful login
        } 
    },[adminToken, isAuthenticated, navigate])

    return (
        <main className="admin-login-main flex-center">
            <div className="">
                {loginErrorMsg && <div className='text-center login-error-msg'><p>{loginErrorMsg}</p></div>}
                <div className='sign-in-section-container'>
                    <div className='container fade-in-down-big'>
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
                </div>
            </div>
        </main>
    );
};

export default AdminSignInPageRender;
