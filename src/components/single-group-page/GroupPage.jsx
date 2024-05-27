import '../../style/SingleGroupPage.css';
import SideBar from '../Menus/SideBarMenu';
import singleGroupData from '../../api/SingleGroupDataApi';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import allUsersOfGroup from '../../api/GetUsersOfAGroupApi';
import earthIcon from '../../assets/svg/earth-africa-solid.svg';
import incognitoIcon from '../../assets/svg/incognito.svg';
import getUserDataById from '../../api/GetUserDataByIdApi';
import eyeIcon from '../../assets/svg/orange-eye.svg';
import policiesIcon from '../../assets/svg/policies.svg';
import DisplayPopover from '../rules-popover/DisplayPopOver';
import ScaleItem from '../scale-items-with-motion/Framer-motion';
import UserWithGroups from '../../api/AddUserToGroupsApi';
import DisplayUploadedPosts from './UploadedPosts';
import insertUserPostIntoGroup from '../../api/CreateUserPostIngroupApi';
import DisplayIncognitoPopover from './IncognitoPostPopover';
import insertUserPostIncognito from '../../api/CreateIncognitoPostApi';
import DisplayRules from './DisplayRulesPopover';



const RenderSinglePostPage = () => {
    // Access the id parameter from the URL
    const { id } = useParams();
    const userId = localStorage.getItem('userId');
    // Store group data
    const [groupData, setGroupData] = useState(null);
    const [usersInGroup, setUserInGroup] = useState(null);
    const [connectedUserData, setConnectedUserData] = useState(null);
    const [post, setPost] = useState('');
    const [groupId, setGroupId] = useState(null);
    // Define a state to track whether the post is incognito
    const [isIncognito, setIsIncognito] = useState(false);


    // Set popover state
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);

    };


    useEffect(() => {
        if (id) {
            async function getGroupUsers(id) {
                const response = await allUsersOfGroup(id);
                console.log('User of group data response are :', response);
                setUserInGroup(response)

            }
            getGroupUsers(id)
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            async function getGroupData(id) {
                const response = await singleGroupData(id);
                console.log('group data response are :', response);
                setGroupData(response);
            }
            getGroupData(id);
        }
    }, [id])

    useEffect(() => {
        if (userId) {
            async function getUserData(id) {
                const response = await getUserDataById(id);
                console.log('userData from group page :', response.user);
                setConnectedUserData(response.user);
            }
            getUserData(userId)
        }
    }, [userId]);

    const handleChange = (e) => {
        setPost(e.target.value);
    }

    useEffect(() => {
        if (userId && groupId) {
            const data = {
                userId,
                groupId
            };
            UserWithGroups(data);
            window.location.reload();
        }
    }, [userId, groupId]);

    // Handle submission of posts
    const submitPost = async (e) => {
        e.preventDefault();
        try {
            // Check if post, groupId, and userId are available
            if (post && groupData && userId) {
                const postData = {
                    postContent: post,
                    groupId: groupData.group_id,
                    userId
                };
                if (!isIncognito) {
                    const newPost = await insertUserPostIntoGroup(postData);
                } else {
                    const newPost = await insertUserPostIncognito(postData);
                }
                // Reset post
                setPost('');
                window.location.reload();
            } else {
                // Handle the case where post, groupId, or userId is not available
                console.error('One or more required fields are missing');
            }
        } catch (error) {
            // Handle errors
            console.error('Uploading post failed:', error);
        }
    };

    function handleIncognito() {
        setIsIncognito(!isIncognito);
        if (!isIncognito) {
            console.log('Is incognito:', isIncognito);
        } else {
            console.log('I Got this')
        }
    };

    return <div className="group-page-container">
        <SideBar />
        <main className='group-main-elements'>
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
                            <div className='public-text'><p className='text-center'>Group publique</p></div>
                        </div>
                        <div className='user-upper-img-container'>
                            {usersInGroup && usersInGroup.map((data, index) => {
                                console.log('users name: ', data.user_name)
                                return (
                                    <div key={index} className='users-img-container'>
                                        <img src={`../../src/${data.user_img}`} alt="users picture" />
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    {groupData && <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 1.3 }}
                        classHandler='add-group-btn-container'
                        children={<button onClick={(e) => setGroupId(groupData.group_id)} >Faire partir du group</button>}
                    />}
                </div>

                <div className='user-post-and-group-description-container'>
                    <div className='user-post-container'>
                        <div className='user-img-and-post-field'>
                            <DisplayPopover className='anonymous-container' rules={<DisplayIncognitoPopover
                                checkedHandler={isIncognito}
                                toggleHandler={handleIncognito} />}
                                children={<div className='anonymous-container'>
                                    <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 1.3 }}
                                        classHandler='anonymous-icon-container'
                                        children={<img src={incognitoIcon} alt=""
                                        />} />
                                    <div className='anonymous-text-container'>
                                        <p>Faire un post à l'anonyma ?</p>
                                    </div>
                                </div>}
                            />
                            <div className='flex-post-field'>
                                <div className='user-connected-img-container'>
                                    {connectedUserData && <img src={`../../src/${connectedUserData.user_img}`} alt="" />}
                                </div>
                                <div className='post-input-field-container'>
                                    <form onSubmit={submitPost}>
                                        <textarea type="text-area" placeholder="Faire un post..." value={post} onChange={handleChange} className='form-control' rows="3" />
                                        {post && <div className='posts-submit-btn'><input type="submit" value='Uploader' /></div>}
                                    </form>
                                </div>
                            </div>
                        </div>
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
                                    {groupData && <p>Ce group a pour but de mener un combat pour la {groupData.group_action}.</p>}
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
                                    <p>Le group étant ouvert à tous, donne le droit à tous utilisateurs de visualiser tous les posts et l'auteur de post. Sauf les posts incognito où le nom et l'image de l'auteur de post ne sera visible qu'aux admins.</p>
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
                                    <p>Group ouvert à tous les utilisateurs</p>
                                </div>
                            </div>
                            <div className='white-right-space'></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
}

export default RenderSinglePostPage;