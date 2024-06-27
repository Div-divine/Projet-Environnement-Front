import { useState, useEffect } from "react";
import '../../style/FirstPage.css';
import GreenSbmtBtn from "../button/GreenSubmitBtn";
import { generateNonce } from "../../generate-nonce/nonce";

const FirstHome = () => {

    const nonce = generateNonce()
    const [isRoot, setIsRoot] = useState(false);

    useEffect(() => {
        setIsRoot(location.pathname === "/");
    }, [location]);

    const RecevoirNewsLetterInput = ({ placeholderHandler }) => {
        const [value, setValue] = useState('');

        function changeValue(e){
            setValue(e.target.value)
        }

       // Prevent newsletter form submit
        function preventSubmit(e){
            e.preventDefault();
            setValue('');
        }

        return <>
            <form onSubmit={(e)=>{preventSubmit(e)}}>
                <div className="first-page-newletter-container">
                    <input type="text" placeholder={placeholderHandler} value={value} onChange={(e)=>changeValue(e)}
                    className="newsletter-input-field" />
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
                    <div className="container fade-in-down-big">
                        <div className="first-page-phrase1-container">
                            <h2 className="first-page-phrase1">Protégeons notre planète.</h2>
                            <h2>Notre plus précieux héritage.</h2>
                        </div>
                        <div className="registration-demand-text">
                            <h1 className="text-center">Rejoignez notre communauté environnementale dynamique 🌍!</h1>
                            <h1 className="text-center">Inscrivez-vous dès maintenant pour un accès exclusif</h1>
                            <h1 className="text-center">aux groupes de discussion écologiques. Ensemble, Faisons la différence!</h1>
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