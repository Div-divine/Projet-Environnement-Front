import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import '../../style/FirstHome.css';
import useStoreValueInputedInField from "../../custom-hooks/HookFormInputController";
import GreenSbmtBtn from "../button/GreenSubmitBtn";

const FirstHome = () => {
    const location = useLocation();
    // Parse the URL and check if the success parameter is true
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success') === 'true';

    const [isRoot, setIsRoot] = useState(false);

    const DisplayRegistrationSuccessMsg = () => {
        const successMsgStyle = {
            color: 'white',
            backgroundColor: 'green',
            width: '600px',
            padding: '10px',
            marginRight: 'auto',
            marginLeft: 'auto',
        }
        return <div className="text-center">
            <p style={successMsgStyle}>Utilisateur crée avec success. Veuillez vous connecter !</p>
        </div>
    }
    useEffect(() => {
        setIsRoot(location.pathname === "/");
    }, [location]);

    const RecevoirNewsLetterInput = ({ placeholderHandler }) => {
        const newsletterStyle = {
            width: '470px',
            height: '35px',
            backgroundColor: 'none',
            border: '0px',
            boxShadow: '1px 1px green'
        }
        const [value, setValue] = useStoreValueInputedInField();

        return <>
            <form action="/" method="post">
                <div className="first-page-newletter-container">
                    <input type="text" placeholder={placeholderHandler} style={newsletterStyle} value={value} onChange={setValue} />
                </div>
                <div>
                    <GreenSbmtBtn value='Envoyer' />
                </div>
            </form>
        </>
    }

    return (
        <>
            <main className="first-main-body">
                <div className={isRoot ? "root-background animated-bg" : "animated-bg"}>
                    <div className="container">
                        <div className="pt-3">
                            {success && <DisplayRegistrationSuccessMsg />}
                        </div>
                        <div className="first-page-phrase1-container">
                            <h2 className="first-page-phrase1">Protégeons notre planète.</h2>
                            <h2>Notre plus précieux héritage.</h2>
                        </div>
                        <div className="first-page-phrase2-container">
                            <h2>Recevoir nos newsletters</h2>
                        </div>
                        <div>
                            <RecevoirNewsLetterInput placeholderHandler='Saisissez votre address mail...' />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default FirstHome;