import '../../style/signIn.css';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../input-field/InputField';
import LabelDisplay from '../input-field/LabelForFiled';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';
import GreenSbmtBtn from '../button/GreenSubmitBtn';
import backwardIcon from '../../assets/svg/backward-solid.svg'
import FirstMenu from '../Menus/FirstPageMenu';


const SignInInputBox = () => {
    const [name, setName] = useStoreValueInputedInField()
    const [surname, setSurname] = useStoreValueInputedInField()
    const [email, setEmail] = useStoreValueInputedInField()
    const [pwd, setPwd] = useStoreValueInputedInField()
    const [pwdConf, setPwdConf] = useStoreValueInputedInField()
    return <div className='container'>
        <div className='registration-field-container'>
            <div className='mb-3 text-center'>
                <p className='sign-in-form-title-text'>Se Connecter</p>
            </div>
            <form action="" method='post'>
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