import SideBar from "../Menus/SideBarMenu";
import DisplayConnectedSmallMenu from "../Menus/DisplaySmallScreenConnectedMenu";
import useUserData from "../../api/UserInfoApi";
import '../../style/setting.css';
import GreenSbmtBtn from "../button/GreenSubmitBtn";
import { useState, useEffect } from "react";
import userIcon from '../../assets/user-profile.svg';
import CustomPwdUpdateModal from "../modalbox/PwdUpdateModalBox";
import updateUserName from "../../api/UpdateUserNameApi";
import updateUserEmail from "../../api/UpdateUserEmailApi";
import { useLocation } from "react-router-dom";

const UserSettings = () => {
    const [openNameModify, setOpenNameModify] = useState(false)
    const [openEmailModify, setOpenEmailModify] = useState(false)
    const [userId, setUserId] = useState(null);
    const initialUserData = useUserData();
    const [userData, setUserData] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedNewName, setUpdatedNewName] = useState('')
    const [updatedNewEmail, setUpdatedNewEmail] = useState('')
    const [displayUpdateNameError, setDisplayUpdateNameError] = useState(false)
    const [displayUpdateEmailError, setDisplayUpdateEmailError] = useState(false)
    const [UpdateNameConflictError, setUpdateNameConflictError] = useState(false)
    const [UpdateEmailConflictError, setUpdateEmailConflictError] = useState(false)
    const [pwdConfSuccessMsg, setPwdConfSuccessMsg] = useState(false);
    const location = useLocation();

    // Get the current location and verify if pwd-config = true in URL, if so display password configuration success message 
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('pwd-conf') == 'true') {
            setPwdConfSuccessMsg(true);
        }
    }, [location]);

    // Remove success message after 3 seconds
    useEffect(() => {
        let timer;
        if (pwdConfSuccessMsg) {
            timer = setTimeout(() => {
                setPwdConfSuccessMsg(false);
            }, 3000); // Set to false after 3 seconds
        }

        return () => clearTimeout(timer); // Cleanup the timer on unmount or when `pwdConfSuccessMsg` changes
    }, [pwdConfSuccessMsg]);


    useEffect(() => {
        if (initialUserData) {
            setUserId(initialUserData.user_id)
            setUpdatedNewName(initialUserData.user_name)
            setUpdatedNewEmail(initialUserData.user_email)
            setUserData(initialUserData)
        }
    }, [initialUserData]);

    useEffect(()=>{
        if(updatedNewName){
            const removeSpace = updatedNewName.replace(/\s+/g, '').trim()
            if(removeSpace.length > 0){
                setDisplayUpdateNameError(false)
                setUpdateNameConflictError(false)
            }
        }
    },[updatedNewName])

    useEffect(()=>{
        if(updatedNewEmail){
            const removeSpace = updatedNewEmail.replace(/\s+/g, '').trim()
            if(removeSpace.length > 0){
                setDisplayUpdateEmailError(false)
                setUpdateEmailConflictError(false)
            }
        }
    },[updatedNewEmail])

    function openUpdateNameField(e) {
        setOpenNameModify(!openNameModify)
        setDisplayUpdateNameError(false)
        setUpdateNameConflictError(false)
    }
    function openUpdateEmailField() {
        setOpenEmailModify(!openEmailModify)
        setDisplayUpdateEmailError(false)
        setUpdateEmailConflictError(false)
    }
    function openUpdatePwdModal() {
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    async function submitUpdateName(e, newName, userId) {
        e.preventDefault()
        try {
            // Prevent empty name form submit
            const noSpaceNewName = newName.replace(/\s+/g, '');
            if (newName && noSpaceNewName.length > 0 && initialUserData) {
                const userNewName = { newName: newName.trim()}
                await updateUserName(userId, userNewName)
                setDisplayUpdateNameError(false)
                setOpenNameModify(!openNameModify)
                // Update to the new name
                setUserData(prevUserData => ({
                    ...prevUserData,
                    user_name: newName.trim()
                }));
            }
            if(noSpaceNewName.length == 0){
                setDisplayUpdateNameError(true)
            }
        } catch (error) {
            console.error('Update User name failed:', error);
            setUpdateNameConflictError(true)
        }
    }
    async function submitUpdateEmail(e, newEmail, userId) {
        e.preventDefault()
        try {
            // Prevent empty name form submit
            const noSpaceNewEmail = newEmail.replace(/\s+/g, '');
            if (newEmail && noSpaceNewEmail.length > 0 && initialUserData) {
                const userNewEmail = { newEmail: newEmail.trim()}
                await updateUserEmail(userId, userNewEmail)
                setDisplayUpdateNameError(false)
                setOpenEmailModify(!openEmailModify)
                // Update to the new email
                setUserData(prevUserData => ({
                    ...prevUserData,
                    user_email: newEmail.trim()
                }));
            }
            if(noSpaceNewEmail.length == 0){
                setDisplayUpdateEmailError(true)
            }
        } catch (error) {
            console.error('Update User name failed:', error);
            setUpdateEmailConflictError(true)
        }
    }

    function redirectToUploadUsrImg(){
        window.location.href='/parametre/photo-de-profile'
    }

    return <>
        <SideBar />
        <main className="unread-msg-main-container">
            <DisplayConnectedSmallMenu />
            {pwdConfSuccessMsg && <div className="unread-msg-and-users-container pwd-conf-success-msg">Mot de passe modifié avec success!</div>}
            {userData && <div className="setting-section-container unread-msg-and-users-container">
                <div className="setting-user-img-container setting-txt">Paramètre</div>
                <div className="setting-user-img-container"><img src={(userData.user_img ? `../../src/${userData.user_img}` : userIcon)} alt="user image" /></div>
                {userData.user_img ? <div className="setting-image-btns-container">
                    <div className="remove-image-display-container"><GreenSbmtBtn value={'Désactiver l\'affichage de photo'} /></div>
                    <div className="replace-image-display-container"><GreenSbmtBtn value={'Changer votre photo de profile'} /></div>
                </div> : <div className="replace-image-display-container" onClick={redirectToUploadUsrImg}><GreenSbmtBtn value={'Uploader une photo de profile'} /></div>}
                { displayUpdateNameError && <div className="name-error name-error-container">Saisissez un nom!</div>}
                {UpdateNameConflictError && <div className="name-error name-error-container">Ce nom existe déja</div>}
                <div className="setting-div-upper-container name-container">
                    <div className="flex-column-div name-title">Nom: </div>
                    <div className="flex-column-div user-info">{userData.user_name}</div>
                    {!openNameModify && <div onClick={openUpdateNameField}><GreenSbmtBtn value={'Modifier'} /></div>}
                    {openNameModify && <div className="setting-form "><form onSubmit={(e) => submitUpdateName(e, updatedNewName, userData.user_id)} className="form-container">
                        <div className='grn-btn-container setting-input-container'>
                            <input type="text" value={updatedNewName} onChange={(e) => setUpdatedNewName(e.target.value)} />
                        </div>
                        <div className="validate-btn-update">
                            <GreenSbmtBtn value={'Valider'} />
                        </div>
                        <div className='grn-btn-container' onClick={openUpdateNameField}><input type="button" value="Annuler" className="green-btn undo-change-btn" /></div>
                    </form>
                    </div>}
                </div>
                {displayUpdateEmailError && <div className="email-error ">Saisissez un Email!</div>}
                {UpdateEmailConflictError && <div className="email-error ">Cet address mail existe déja</div>}
                <div className="setting-div-upper-container">
                    <div className="flex-column-div name-title">Email: </div>
                    <div className="flex-column-div user-info">{userData.user_email}</div>
                    {!openEmailModify && <div onClick={openUpdateEmailField}><GreenSbmtBtn value={'Modifier'} /></div>}
                    {openEmailModify && <div className="setting-form "><form onSubmit={(e) => submitUpdateEmail(e, updatedNewEmail, userData.user_id)} className="form-container">
                        <div className='grn-btn-container setting-input-container'>
                            <input type="text" value={updatedNewEmail} onChange={(e) => setUpdatedNewEmail(e.target.value)} />
                        </div>
                        <div className="validate-btn-update">
                            <GreenSbmtBtn value={'Valider'} />
                        </div>
                        <div className='grn-btn-container' onClick={openUpdateEmailField}><input type="button" value="Annuler" className="green-btn undo-change-btn" /></div>
                    </form>
                    </div>}
                </div>
                <div className="setting-div-upper-container">
                    <div className="flex-column-div name-title">Mots de passe: </div>
                    <div className="flex-column-div user-info">Non visible</div>
                    <div onClick={openUpdatePwdModal}><GreenSbmtBtn value={'Modifier'} /></div>
                </div>
            </div>}
        </main >
        {isModalOpen && userId && (
            <CustomPwdUpdateModal
                title="Modifier votre mot de passe ?"
                message="Pour la sécurité de votre compte, veuillez rentrer d'abords votre mot de passe actuel avant de saissir un nouveau"
                onClose={handleCloseModal}
            />
        )}
    </>
}

export default UserSettings; 