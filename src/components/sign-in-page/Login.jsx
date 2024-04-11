import '../../style/signIn.css';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../input-field/InputField';
import LabelDisplay from '../input-field/LabelForFiled';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import GreenSbmtBtn from '../button/GreenSubmitBtn';
import backwardIcon from '../../assets/svg/backward-solid.svg'
import FirstMenu from '../Menus/FirstPageMenu';
import Axios from 'axios';


const SignInInputBox = () => {
    const [email, setEmail] = useStoreValueInputedInField()
    const [pwd, setPwd] = useStoreValueInputedInField()

    // Function to authenticate user and obtain tokens
    const loginUser = async (credentials) => {
        try {
            // Send POST request to /login endpoint with user credentials
            const response = await Axios.post('http://localhost:3000/users/login', credentials);
            console.log('response:', response);
            // Extract the token from the response
            const token = response.data.token; // Assuming the token is stored in data
            console.log('Access token:', token);
            return token; // Return the token
        } catch (error) {
            // Handle errors (e.g., invalid credentials, server errors)
            console.error('Error logging in:', error);
            throw error; // Propagate the error to the caller
        }
    };

    const login = async (e) => {
        e.preventDefault();
        try {
            const credentials = {
                email: email,
                password: pwd,
            };
            const token = await loginUser(credentials); // No need to destructure
            console.log('Access token:', token);
            // Store tokens in local storage or cookies, etc.
        } catch (error) {
            // Handle login errors
            console.error('Login failed:', error);
        }
    };
    return <div className='container'>
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

                <GreenSbmtBtn value='Enregistrer' />
            </form>
        </div>
    </div>
}

const SignInPageRender = () => {

    const location = useLocation();
    const [signInBgrd, setSignInBgrd] = useState(false);
    useEffect(() => {
        setSignInBgrd(location.pathname === "/connexion" || location.pathname === "/connexion/");
    }, [location]);

    return <>
        <div>
            <FirstMenu />
        </div>
        <main className="sign-in-main-body">
            <div className={setSignInBgrd ? "sign-in-background animated-bg" : "animated-bg"}>
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