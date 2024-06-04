import SideBar from "../Menus/SideBarMenu";
import DisplayConnectedSmallMenu from "../Menus/DisplaySmallScreenConnectedMenu";
import useUserData from "../../api/UserInfoApi";
import '../../style/setting.css';
import GreenSbmtBtn from "../button/GreenSubmitBtn";
import { useState, useEffect } from "react";
import userIcon from '../../assets/user-profile.svg';
import CustomPwdUpdateModal from "../modalbox/PwdUpdateModalBox";

const UserSettings = () => {
    const [openNameModify, setOpenNameModify] = useState(false)
    const [openEmailModify, setOpenEmailModify] = useState(false)
    const [openPwdModify, setOpenPwdModify] = useState(false)
    const [userId, setUserId] = useState(null);
    const userData = useUserData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(()=>{
        if(userData){
          setUserId(userData.user_id)
        }
      },[userData]);

    function openUpdateNameField(e) {
        setOpenNameModify(!openNameModify)
    }
    function openUpdateEmailField() {
        setOpenEmailModify(!openEmailModify)
    }
    function openUpdatePwdModal() {
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
      };

      const handlePwdUpdateSubmit = () =>{
        setIsModalOpen(false);
      }

    return <>
        <SideBar />
        <main className="unread-msg-main-container">
            <DisplayConnectedSmallMenu />
            {userData && <div className="setting-section-container unread-msg-and-users-container">
                <div className="setting-user-img-container setting-txt">Paramètre</div>
                <div className="setting-user-img-container"><img src={(userData.user_img ? `../../src/${userData.user_img}` : userIcon)} alt="user image" /></div>
                {userData.user_img ? <div className="setting-image-btns-container">
                    <div className="remove-image-display-container"><GreenSbmtBtn value={'Désactiver l\'affichage de photo'} /></div>
                    <div className="replace-image-display-container"><GreenSbmtBtn value={'Changer votre photo de profile'} /></div>
                </div> : <div className="replace-image-display-container"><GreenSbmtBtn value={'Uploader une photo de profile'} /></div>}
                <div className="setting-div-upper-container name-container">
                    <div className="flex-column-div name-title">Nom: </div>
                    <div className="flex-column-div user-info">{userData.user_name}</div>
                    {!openNameModify && <div onClick={openUpdateNameField}><GreenSbmtBtn value={'Modifier'} /></div>}
                    {openNameModify && <div className="setting-form "><form action="" className="form-container">
                        <div className='grn-btn-container setting-input-container'>
                            <input type="text" />
                        </div>
                        <div className="validate-btn-update">
                            <GreenSbmtBtn value={'Valider'} />
                        </div>
                        <div className='grn-btn-container' onClick={openUpdateNameField}><input type="button" value="Annuler" className="green-btn undo-change-btn" /></div>
                    </form>
                    </div>}
                </div>
                <div className="setting-div-upper-container">
                    <div className="flex-column-div name-title">Email: </div>
                    <div className="flex-column-div user-info">{userData.user_email}</div>
                    {!openEmailModify && <div onClick={openUpdateEmailField}><GreenSbmtBtn value={'Modifier'} /></div>}
                    {openEmailModify && <div className="setting-form "><form action="" className="form-container">
                        <div className='grn-btn-container setting-input-container'>
                            <input type="text" />
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
          onformSubmit={handlePwdUpdateSubmit}
        />
      )}
    </>
}

export default UserSettings; 