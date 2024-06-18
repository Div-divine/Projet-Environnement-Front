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
import { useLocation, useNavigate } from "react-router-dom";
import removeUserDisplayedImg from "../../api/UpdateUserToRemoveDisplayedImgApi";
import userDisplayedImg from "../../api/DisplayUserImgApi";

const UserSettings = () => {
    const navigate = useNavigate()
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
    const [profileImgUpdate, setProfileImgUpdate] = useState(false);
    const location = useLocation();
    const [removeProfileImg, setRemoveProfileImg] = useState(false)
    const [displayProfileImg, setDisplayProfileImg] = useState(false)

    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';

    // Get the current location and verify if pwd-config = true in URL, if so display password configuration success message 
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('pwd-conf') == 'true') {
            setPwdConfSuccessMsg(true);
        }
    }, [location]);

    // Get the current location and verify if upload-img-success = true in URL, if so display password configuration success message 
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('upload-img-success') == 'true') {
            setProfileImgUpdate(true);
        }
    }, [location]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('modif-img-profile') == 'true') {
            setRemoveProfileImg(true);
        }
    }, [location]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('img-profile') == 'true') {
            setDisplayProfileImg(true);
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

     // Remove success image upload message after 3 seconds
     useEffect(() => {
        let timer;
        if (profileImgUpdate) {
            timer = setTimeout(() => {
                setProfileImgUpdate(false);
            }, 3000); // Set to false after 3 seconds
        }

        return () => clearTimeout(timer); // Cleanup the timer on unmount or when `pwdConfSuccessMsg` changes
    }, [profileImgUpdate]);

    useEffect(() => {
        let timer;
        if (removeProfileImg) {
            timer = setTimeout(() => {
                setRemoveProfileImg(false);
            }, 3000); // Set to false after 3 seconds
        }

        return () => clearTimeout(timer); // Cleanup the timer on unmount or when `pwdConfSuccessMsg` changes
    }, [removeProfileImg]);

    useEffect(() => {
        let timer;
        if (displayProfileImg) {
            timer = setTimeout(() => {
                setDisplayProfileImg(false);
            }, 3000); // Set to false after 3 seconds
        }

        return () => clearTimeout(timer); // Cleanup the timer on unmount or when `pwdConfSuccessMsg` changes
    }, [displayProfileImg]);





    useEffect(() => {
        if (initialUserData) {
            setUserId(initialUserData.user_id)
            setUpdatedNewName(initialUserData.user_name)
            setUpdatedNewEmail(initialUserData.user_email)
            setUserData(initialUserData)
            console.log('User initial data:', initialUserData)
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
        navigate('/parametre/photo-de-profile')
    }
    
    function changeProfileImg(){
        navigate('/parametre/photo-de-profile')
    }

    async function removeDisplayedImg(userId) {
        const response = await removeUserDisplayedImg(userId);
        console.log('User displayed image removed:', response);
        if (response.data.message == 'User image display removed successfully!') {
            navigate('/parametre?modif-img-profile=true');
        }
        return response.data
    }

    async function activateDisplayedImg(userId) {
        const response = await userDisplayedImg(userId);
        console.log('User displayed image:', response);
        if (response.data.message == 'User image display added successfully!') {
            navigate('/parametre?img-profile=true')
        }
        return response.data
    }

    return <>
        <SideBar />
        <main className="unread-msg-main-container">
            <DisplayConnectedSmallMenu />
            {pwdConfSuccessMsg && <div className="unread-msg-and-users-container pwd-conf-success-msg">Mot de passe modifié avec success!</div>}
            {profileImgUpdate && <div className="unread-msg-and-users-container pwd-conf-success-msg">Image de profile ajoutée avec success!</div>}
            {removeProfileImg && <div className="unread-msg-and-users-container pwd-conf-success-msg remove-profile-img-msg">Image de profile désactivée!</div>}
            {displayProfileImg && <div className="unread-msg-and-users-container pwd-conf-success-msg">Affichage d'image de profile faite avec succ!</div>}
            {userData && <div className="setting-section-container unread-msg-and-users-container">
                <div className="setting-user-img-container setting-txt">Paramètre</div>
                <div className="setting-user-img-container"><img src={(userData.user_img && userData.show_user_image ? `${imgUrl}/${userData.user_img}` : userIcon)} alt="user image" /></div>
                {userData.user_img ? <div className="setting-image-btns-container">
                    {userData.show_user_image ? <div onClick={() => removeDisplayedImg(userData.user_id)} className="remove-image-display-container"><GreenSbmtBtn value={'Désactiver l\'affichage de photo'} /></div> :
                    <div  onClick={() => activateDisplayedImg(userData.user_id)} className="remove-image-display-container" ><GreenSbmtBtn value={'Activer l\'affichage de photo'} /></div>}
                    <div className="replace-image-display-container" onClick={changeProfileImg}><GreenSbmtBtn value={'Changer votre photo de profile'} /></div>
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