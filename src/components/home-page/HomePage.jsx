import SideBar from "../Menus/SideBarMenu";
import '../../style/HomePage.css';
import addIcon from '../../assets/add-square.svg';
import eyeIcon from '../../assets/eye-solid.svg';
import { useEffect, useState } from "react";
import useGroupsData from "../../api/AllGroupsDataApi";
import { Link, useLocation } from "react-router-dom";
import useUserData from "../../api/UserInfoApi";
import { motion } from 'framer-motion';
import UserWithGroups from "../../api/AddUserToGroupsApi";
import DisplayConnectedSmallMenu from "../Menus/DisplaySmallScreenConnectedMenu";


const RenderHome = () => {

    const location = useLocation();
    const userData = useUserData();
    const [postId, setPostId] = useState(null);

    useEffect(() => {
        if (userData && postId) {
            const data = {
                userId: userData.user_id,
                groupId: postId
            };
            UserWithGroups(data);
            window.location.reload();
        }
    }, [userData, postId]);


    const allGroupsData = () => {
        const groupsData = useGroupsData();
        const [data, setData] = useState(null);
        useEffect(() => {
            setData(groupsData); // This will log the fetched data
        }, [groupsData]); // This ensures the log statement runs whenever `userData` changes
        return data;
    }

    const groupsDatas = allGroupsData();
    console.log(groupsDatas)
    return <div className="home-page-container">
        <SideBar />
        <main className="main-elements">
        <DisplayConnectedSmallMenu />
            <div className="main-body-container">
                <div className="text-center welcom-msg-container">
                    <p className="welcom-msg">Merci de nous avoir rejoint dans cette mission pour sauver la planète ! </p>
                    <p className="welcom-msg"><span className="welcom-msg-green">Vos actions font toute la différence</span></p>
                </div>
                <div className="group-upper-title-container">
                    <p className="group-upper-title">Groups d'action</p>
                </div>
                <div className="groups-container">
                    {groupsDatas && groupsDatas.map((data) => {
                        // Sauvegarder le group id
                        localStorage.setItem('groupId', data.group_id);
                        return (
                            <div className="water-container mb-3" key={data.group_id} style={{ backgroundImage: `url('../../src/${data.group_img}')` }}>
                                <div className="icon-and-btns-container">
                                    <div className="water-icon-and-text-conatiner">
                                        <div className="water-icon-conatiner">
                                            <img src={`../../src/${data.group_icon}`} alt="water icon" />
                                        </div>
                                        <div className="water-text-container">
                                            <p className="water-resources-text">{data.group_name}</p>
                                        </div>
                                    </div>
                                    <div className="add-and-viste-icon-and-text-container">
                                        <motion.div whileTap={{ scale: 1.2 }}
                                            className="add-and-text-conatiner"
                                            onClick={(e) => {
                                                setPostId(data.group_id)
                                            }}>
                                            <Link className="add_icon_container">
                                                <img src={addIcon} alt="" />
                                            </Link>
                                            <Link className="add-text-container">
                                                <p className="texts">Ajouter</p>
                                            </Link>
                                        </motion.div>

                                        <Link to={`/${data.group_name.toLowerCase().replace(/ /g, '-')}/${data.group_id}`} className="visit-container">
                                            <div className="visit-icon-container">
                                                <img src={eyeIcon} alt="" />
                                            </div>
                                            <div className="visit-text-container">
                                                <p className="texts">Visiter</p>
                                            </div>
                                        </Link>

                                    </div>
                                </div>
                                <div className="action-text-container">
                                    <div className="text-center action-text"><p>Actions</p></div>
                                    <div className="action-description-container">
                                        <p className="text-center">-{data.group_action.split(',')[0]}</p>
                                        {data.group_action.split(',')[1] && <p className="text-center mt-2">-{data.group_action.split(',')[1]}</p>}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
        </main>
    </div>
}

export default RenderHome;