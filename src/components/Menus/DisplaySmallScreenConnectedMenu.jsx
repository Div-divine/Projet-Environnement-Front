import ConnectedUserSmallScreenMenu from "./mobile-and-small-tablette/ConnectedSmallMenu";
import SmallScreenOpenGroup from "./mobile-and-small-tablette/ConnectedSmallScreenGroupOpen";
import { useState } from "react";

const DisplayConnectedSmallMenu = () => {

    const [openMenu, setOpenMenu] = useState(false);

    // Handler mobile and small tablette menu, handle the menu to display when menu is opened or closed
    function menuHandler() {
        setOpenMenu(!openMenu)
    }
    function closeMenu() {
        
        setOpenMenu(false);
    }

    return <>
        {!openMenu ? <ConnectedUserSmallScreenMenu menuHandler={menuHandler}/> : <SmallScreenOpenGroup closeMenu={closeMenu}/>}
    </>
}

export default DisplayConnectedSmallMenu;