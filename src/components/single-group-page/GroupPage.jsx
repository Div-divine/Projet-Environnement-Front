import '../../style/SingleGroupPage.css';
import SideBar from '../Menus/SideBarMenu';
import singleGroupData from '../../api/SingleGroupDataApi';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import allUsersOfGroup from '../../api/GetUsersOfAGroupApi';
import earthIcon from '../../assets/earth-africa-solid.svg';
import eyeIcon from '../../assets/orange-eye.svg';
import userIcon from '../../assets/user-profile.svg';
import policiesIcon from '../../assets/policies.svg';
import DisplayPopover from '../rules-popover/DisplayPopOver';
import ScaleItem from '../scale-items-with-motion/Framer-motion';
import UserWithGroups from '../../api/AddUserToGroupsApi';
import DisplayUploadedPosts from './UploadedPosts';
import DisplayRules from './DisplayRulesPopover';
import DisplayConnectedSmallMenu from '../Menus/DisplaySmallScreenConnectedMenu';
import GetUserInGroup from '../../api/GetUserIfInAGroupApi';
import CustomModal from '../modalbox/CustomModalBox';
import userQuitsGroup from '../../api/HandleUserQuitsGroupApi';
import userQuitGroupSatus from '../../api/getUserQuitGroupStatusApi';

const RenderSinglePostPage = () => {

    const navigate = useNavigate()
    // Access the id parameter from the URL
    const { id } = useParams()
    const [firstParamsId, setFirstParamsId] = useState(null)
    const [uuidParamsId, setUuidParamsId] = useState(null)
    const userId = localStorage.getItem('userId');
    // Store group data
    const [groupData, setGroupData] = useState(null);
    const [usersInGroup, setUserInGroup] = useState(null);
    const [alreadyMember, setAlreadyMember] = useState(null)
    const [isMemId, setISMemId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedGroupId, setClickedGroupId] = useState(null);
    const [userLeft, setUserLeft] = useState(null)

    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';

    useEffect(() => {
        if (id) {
            const firstId = id.slice(0, 1);
            const intoNum = +firstId;
            const secondId = id.slice(1)
            
            setUuidParamsId(secondId)
            setFirstParamsId(intoNum);
        }
    }, [id])

    useEffect(() => {
        if (firstParamsId) {
            async function getGroupData(id) {
                const response = await singleGroupData(id);
                console.log('group data response are :', response);
                setGroupData(response);
            }
            getGroupData(firstParamsId);
        }
    }, [firstParamsId])



    useEffect(() => {
        if (firstParamsId && userId) {

            async function userIdInGroup(id) {
                const getMemberId = await GetUserInGroup({ userId, groupId: id })
                console.log('Is a member Id:', getMemberId.user_id)
                setISMemId(getMemberId.user_id)
            }

            userIdInGroup(firstParamsId)
        }

    }, [firstParamsId, userId])

    // Change user membership status once he is no more part of group
    useEffect(() => {
        if (userId && firstParamsId) {
            async function getStatusQuit(user, group) {
                const response = await userQuitGroupSatus(user, group);
                console.log('Quit group status:', response)
                setUserLeft(response.quit_group);
                return response;
            }
            getStatusQuit(userId, firstParamsId);
        }
    }, [userId, firstParamsId])


    useEffect(() => {
        if (isMemId && userLeft != 1) {
            setAlreadyMember(true)
        } else {
            setAlreadyMember(false)
        }
    }, [isMemId, userLeft])

    // Check if user quit group

    // Set popover state
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);

    };


    useEffect(() => {
        if (firstParamsId) {
            async function getGroupUsers(firstParamsId) {
                const response = await allUsersOfGroup(firstParamsId);
                console.log('User of group data response are :', response);
                setUserInGroup(response)

            }
            getGroupUsers(firstParamsId)
        }
    }, [firstParamsId]);


    async function addUserToGroup(groupId, id, groupName){
            if(groupId && id && groupName){
                const data = {
                    userId,
                    groupId
                };
                await UserWithGroups(data);
                window.location.href=`/${groupName}/${id}?group-added=true`
            }
    }

    const handleDeleteGroup = (groupId) => {
        setClickedGroupId(groupId);
        console.log('Group to delete:', groupId)
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleQuitGroup = async () => {
        if (userId && clickedGroupId) {
            try {
                await userQuitsGroup(clickedGroupId, { userId });
                navigate('/accueil');
            } catch (error) {
                console.error('Error deleting friend:', error);
            }
        }
    };
    return <div className="group-page-container">
        <SideBar />
        <main className='group-main-elements'>
            <DisplayConnectedSmallMenu />
            <div className='group-inner-container'>
                {groupData && <div >
                    <div className='group-img-container'>
                        <img src={`../../src/${groupData.group_img}`} alt="" className='group-img' />
                    </div>
                    <div className='group-name-container'>
                        <p className='text-center'>{groupData.group_name}</p>
                    </div>
                </div>}
                <div className='big-container'>
                    <div className='images-group'>
                        <div className='flex-icon-and-group-status'>
                            <div className='earth-icon-container'>
                                <img src={earthIcon} alt="" />
                            </div>
                            <div className='public-text'><p className='text-center'>Groupe publique</p></div>
                        </div>
                        <div className='user-upper-img-container'>
                            {usersInGroup && usersInGroup.map((data, index) => {
                                console.log('users name: ', data.user_name)
                                return (
                                    <div key={index} className='users-img-container'>
                                        {data.user_img && data.show_user_image ? <img src={`${imgUrl}/${data.user_img}`} alt="users picture" />
                                            : <img src={userIcon} alt="users picture" />}
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    {groupData && userId && firstParamsId &&  id && <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 1.3 }}
                        classHandler='add-group-btn-container'
                        children={(!alreadyMember ? <button className='add-group-btn' onClick={() => addUserToGroup(groupData.group_id, id, groupData.group_name)} >Faire partir du groupe</button>
                            : <button className='quit-group-btn' onClick={() => handleDeleteGroup(groupData.group_id)}>Quitter le groupe</button> )}
                    />}
                </div>
                <div className='user-post-and-group-description-container'>
                    <div className='user-post-container'>
                        <DisplayPopover rules={<div className='big-screen-rule-option-text'>Clickez sur l'icon ou sur la phrase!</div>}
                            children={<div className='public-and-icon-container policies-container'>

                                <ScaleItem hover={{ scale: 1.3 }} tap={{ scale: 0.9 }}
                                    classHandler='post-earth-icon-container'
                                    children={<img src={policiesIcon} alt=""
                                        onClick={handleOpen} />} />
                                <ScaleItem hover={{ scale: 1.05 }} tap={{ scale: 0.9 }}
                                    classHandler='public-text-container'
                                    children={<p onClick={handleOpen}>Pour s'assurrer que tout se passe bien! </p>} />
                            </div>} />
                        {groupData && <DisplayRules isOpen={isOpen} handleClose={handleClose} groupData={groupData} />}
                        <div className='post-in-group-text-section'>
                            {groupData && <DisplayUploadedPosts groupId={groupData.group_id} />}
                        </div>
                    </div>
                    <div className='group-description-container'>
                        <div className='sticky-section'>
                            <div className='group-descriptions-inner'>
                                <div className='abt-group-container'>
                                    <p>À propos</p>
                                </div>
                                <div className='group-decsription-container'>
                                    {groupData && <p>Ce groupe a pour but de mener un combat pour la {groupData.group_action}.</p>}
                                </div>
                                <div className='public-and-icon-container'>
                                    <div className='post-earth-icon-container'>
                                        <img src={earthIcon} alt="" />
                                    </div>
                                    <div className='public-text-container'>
                                        <p >Publique</p>
                                    </div>
                                </div>
                                <div className='group-decsription-container'>
                                    <p>Le groupe étant ouvert à tous, donne le droit à tous utilisateurs de visualiser tous les posts et l'auteur de post. Sauf les posts incognito où le nom et l'image de l'auteur de post ne seront visible qu'aux admins.</p>
                                </div>
                                <div className='public-and-icon-container'>
                                    <div className='post-earth-icon-container'>
                                        <img src={eyeIcon} alt="" />
                                    </div>
                                    <div className='public-text-container'>
                                        <p>Visibilité</p>
                                    </div>
                                </div>
                                <div className='group-decsription-container'>
                                    <p>Groupe ouvert à tous les utilisateurs</p>
                                </div>
                            </div>
                            <div className='white-right-space'></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        {isModalOpen && clickedGroupId && (
            <CustomModal
                title={<div className='group-delete-request'>Quitter le groupe ?</div>}
                message={<><div>Par défaut quitter un groupe ne supprimera pas les contributions que vous avez portées au group (posts et commantaires). Néanmoins tous vos posts et commantaires passeront au status incognito. Les utilisateurs ne verrons donc pas votre nom ni image associé aux posts ou aux commantaires sauf les admins.</div>
                    <div className='group-delete-request-container'><span className='leave-group-instruction-subject'>. Vos contenus sont précieux: </span><span>Etant donné que vos publications sont informatives, perspicaces ou ont contribué positivement au groupe, il peut être bénéfique de les conserver pour référence future.</span></div>
                    <div><span className='leave-group-instruction-subject'>. Maintien de la cohérence: </span><span> La suppression de publications peut créer des lacunes dans le flux du contenu du groupe et le faire paraître incomplet.</span></div>
                    <div><span className='leave-group-instruction-subject'>. Respect des contributions des utilisateurs: </span><span>Comme pour les commentaires, la suppression de publications peut sembler dédaigneuse des contributions de l'utilisateur au groupe.</span></div>
                    <div className='group-delete-request-container'>Vous displosez le droit de demander à supprimer tous vos posts et commantaires, <span className='group-delete-request'>cliquez sur cette phrase rouge</span>. En précisant vos raisons de quitter le groupe vous nous aidez à amméliorer le groupe. Merci</div></>}
                buttonText="Quitter le groupe"
                onClose={handleCloseModal}
                onButtonClick={handleQuitGroup}
            />
        )}
    </div>
}

export default RenderSinglePostPage;