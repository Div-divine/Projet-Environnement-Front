import React, { useState, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import "../../style/FirstPage.css";
import "../../style/FirstPageMenu.css"
import Logo from "../../../logo/white-logo.svg";
import WhiteGlobe from "../../../logo/white-globe.svg";
import { motion } from 'framer-motion';
import useSelectOptionValue from "../../custom-hooks/HookSelectOptionsController";
import SmallMenu from "./mobile-and-small-tablette/SmallScreenMenu";
import HamburgerMenu from "./mobile-and-small-tablette/OpenMenu";
import { generateNonce } from "../../generate-nonce/nonce";

const FirstMenu = () => {
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const nonce = generateNonce()
    const [openMenu, setOpenMenu] = useState(false);

    // Handler mobile and small tablette menu, handle the menu to display when menu is opened or closed
    function menuHandler() {
        setOpenMenu(!openMenu)
    }
    function closeMenu() {
        setOpenMenu(false);
    }

    const [language, setLanguage] = useSelectOptionValue('French')

    return (
        <div>
            <header className="stick-menu-top">
                <nav className="first-page-stick-menu-top">
                    <div className="big-screeen-first-page-menu">
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
                                        className="menu-connexion-link"
                                    >
                                        Se connecter
                                    </Link>
                                </div>
                                <motion.div className="center-menu-item" whileTap={{ scale: 1.2 }}>
                                    <input type="button" value="Blog" className="btn-blog" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    <div className="mobile-and-small-tablette-first-page-menu">
                       {openMenu ? <HamburgerMenu closeMenu={closeMenu} /> : <SmallMenu menuHandler={menuHandler} /> }
                    </div>
                </nav>
            </header>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default FirstMenu;
