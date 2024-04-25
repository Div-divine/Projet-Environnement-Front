import '../../style/SingleGroupPage.css';
import SideBar from '../Menus/SideBarMenu';
import singleGroupData from '../../api/SingleGroupDataApi';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import allUsersOfGroup from '../../api/GetUsersOfAGroupApi';
import earthIcon from '../../assets/svg/earth-africa-solid.svg';
import incognitoIcon from '../../assets/svg/incognito.svg';
import getUserDataById from '../../api/GetUserDataByIdApi';
import { motion } from 'framer-motion';
import eyeIcon from '../../assets/svg/orange-eye.svg';
import policiesIcon from '../../assets/svg/policies.svg';

const RenderSinglePostPage = () => {
    // Access the id parameter from the URL
    const { id } = useParams();
    const userId = localStorage.getItem('userId');
    // Store group data
    const [groupData, setGroupData] = useState(null);
    const [usersInGroup, setUserInGroup] = useState(null);
    const [connectedUserData, setConnectedUserData] = useState(null);
    const [post, setPost] = useState('')

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
        e.preventDefault;
        setPost(e.target.value);
    }

    return <div className="group-page-container">
        <header>
            <nav>
                <SideBar />
            </nav>
        </header>
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
                <div className='user-post-and-group-description-container'>
                    <div className='user-post-container'>
                        <div className='user-img-and-post-field'>
                            <div className='flex-post-field'>
                                <div className='user-connected-img-container'>
                                    {connectedUserData && <img src={`../../src/${connectedUserData.user_img}`} alt="" />}
                                </div>
                                <div className='post-input-field-container'>
                                    <form >
                                        <textarea type="text-area" placeholder="Faire un post..." value={post} onChange={handleChange} className='form-control' rows="3" />
                                    </form>
                                </div>
                            </div>
                            <div className='anonymous-container'>
                                <motion.div
                                    whileTap={{ scale: 1.3 }}
                                    className='anonymous-icon-container'>
                                    <img src={incognitoIcon} alt="" />
                                </motion.div>
                                <div className='anonymous-text-container'>
                                    <p>Faire un post à l'anonyma</p>
                                </div>
                            </div>
                        </div>
                        <div className='public-and-icon-container policies-container'>
                            <div className='post-earth-icon-container'>
                                <img src={policiesIcon} alt="" />
                            </div>
                            <div className='public-text-container'>
                                <p>Pour s'assurrer que tout se passe bien! </p>
                            </div>
                        </div>
                    </div>
                    <div className='group-description-container'>
                        <div className='group-descriptions-inner'>
                            <div className='abt-group-container'>
                                <p>À propos</p>
                            </div>
                            <div className='group-decsription-container'>
                                {groupData && <p>Ce plate-forme a pour but de mener un combat pour la {groupData.group_action}</p>}
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
                                <p>Le group étant ouvert à tous, ceci donne le droit à tous utilisateurs de visualiser tous les posts et l'auteur de post.</p>
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
                                <p>Group ouvert à tous les utilisaeurs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
}

export default RenderSinglePostPage;