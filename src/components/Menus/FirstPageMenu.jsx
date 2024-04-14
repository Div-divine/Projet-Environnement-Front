import React, { useState, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import "../../style/FirstPage.css";
import "../../style/FirstPageMenu.css"
import Logo from "../../../logo/white-logo.svg";
import WhiteGlobe from "../../../logo/white-globe.svg";
import { motion } from 'framer-motion';
import useSelectOptionValue from "../../custom-hooks/HookSelectOptionsController";

const FirstMenu = () => {
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const selectRef = useRef(null);

    const menuLink1 = {
        textDecoration: "none",
        color: isHovered1 ? "#FF9C00": "white",
        fontWeight : isHovered1 ? '700': '' ,
    };

    const menuLink2 = {
        textDecoration: "none",
        color: isHovered2 ? "#FF9C00" : "white",
        fontWeight : isHovered2 ? '700': '' ,
    };

    const handleWhiteGlobeClick = () => {
        if (selectRef.current) {
            selectRef.current.focus();
        }
    };
    const [language, setLanguage] = useSelectOptionValue('French')

    return (
        <>
            <header>
                <nav className="first-page-stick-menu-top">
                    <div className="menu-container">
                        <div className="logo-with-text-container">
                            <Link to={'/'} className="logo-with-text-inner-container">
                                <div className="logo-container">
                                    <img src={Logo} alt="Website Logo" />
                                </div>
                                <div className="loge-text-container">
                                    <p className="logo-text">EcoConscience</p>
                                </div>
                            </Link>
                        </div>
                        <div className="menu-items-container">
                            <div className="menu-language-container">
                                <div className="language-white-globe-icon-conatiner center-menu-item">
                                    <img
                                        src={WhiteGlobe}
                                        alt="white globe"
                                        onClick={handleWhiteGlobeClick}
                                    />
                                </div>
                                <div className="language-select-container center-menu-item">
                                    <select name="languages" id="languages" className="select-field" value={language} onChange={setLanguage}>
                                        <option value="French">Français</option>
                                        <option value="English">Anglais</option>
                                        <option value="Russian">Russe</option>
                                        <option value="Chinese">Chinois</option>
                                    </select>

                                </div>
                            </div>
                            <div className="center-menu-item">
                                <Link
                                    to={"/connexion"}
                                    style={menuLink1}
                                    onMouseEnter={() => setIsHovered1(true)}
                                    onMouseLeave={() => setIsHovered1(false)}
                                >
                                    Se connecter
                                </Link>
                            </div>
                            <div className="center-menu-item">
                                <Link
                                    to={"/inscription"}
                                    style={menuLink2}
                                    onMouseEnter={() => setIsHovered2(true)}
                                    onMouseLeave={() => setIsHovered2(false)}
                                >
                                    S'inscrire
                                </Link>
                            </div>
                            <motion.div className="center-menu-item" whileTap={{ scale: 1.2 }}>
                                <input type="button" value="Blog" className="btn-blog" />
                            </motion.div>
                        </div>
                    </div>
                </nav>
            </header>
            <div>
                <Outlet />
            </div>
        </>
    );
};

export default FirstMenu;
