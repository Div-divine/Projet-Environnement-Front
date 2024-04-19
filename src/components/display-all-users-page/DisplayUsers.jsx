import { useState, useEffect } from "react";
import SideBar from "../Menus/SideBarMenu";
import AllUsers from "../../api/GetAllUsersApi";
import climatChangeIcon from '../../assets/svg/climate-change.svg';
import biodiversityIcon from '../../assets/svg/icon-biodiversity.svg';
import wasteManagementIcon from '../../assets/svg/icon-wastemanagement.svg';
import teamSpeakIcon from '../../assets/svg/teamspeak.svg';
import threeIcon from '../../assets/svg/three.svg';
import waterIcon from '../../assets/svg/water-icon.svg';
import windIcon from '../../assets/svg/wind-solid.svg';
import userIcon from '../../assets/svg/user-solid.svg';
import '../../style/DisplayAllUsers.css';
import likeIcon from '../../assets/svg/heart-solid.svg';
import chatIcon from '../../assets/svg/comment-solid.svg';


const RenderAllUsers = () => {
    const userId = localStorage.getItem('userId');
    const [users, setUsers] = useState([]);
    const [usersData, setUsersData] = useState(null);
    // Save icon paths in icons to be used in map
    const icons = [
        climatChangeIcon,
        biodiversityIcon,
        wasteManagementIcon,
        teamSpeakIcon,
        threeIcon,
        waterIcon,
        windIcon
    ]
    // Get all  except the user logged in users ordered by the most recently registered
    useEffect(() => {
        async function usersRetrieve() {
            if (userId) {
                try {
                    const response = await AllUsers(userId);
                    setUsersData(response.data)
                    console.log('Users listing: ', response.data);
                    //setUserGroups(response.data);
                } catch (error) {
                    console.error('Error fetching user groups:', error);
                }
            }
        }
        usersRetrieve();
    }, [userId]);

    // Add the fetched data to users
    useEffect(() => {
        if (usersData) {
            setUsers(usersData.map(data => data));
        }
    }, [usersData]);

    if (users) {
        return (<div className="home-page-container">
            <header>
                <nav>
                    <SideBar showUser={false} />
                </nav>
            </header>
            <main className="main-elements main-users">
                <div className="all-users-main-container">
                    {users && users.map((user, index) => (
                        <div key={index} className='all-users-container'>
                            <div className="user-icon-section">
                                <div className="all-users-icon-container">
                                    <img src={icons[index % icons.length]} alt={`Icon for ${user.user_name}`} />
                                </div>
                            </div>
                            <div className="like-user-section">
                                <div className="flex-user-and-like-icon">
                                    <div className="user-name-icon-and-text">
                                        <div className="user-name-icon">
                                            <img src={userIcon} alt="" />
                                        </div>
                                        <div className="user-name-text">
                                            <p>{user.user_name}</p>
                                        </div>
                                    </div>
                                    <div className="like-icon">
                                        <img src={likeIcon} alt="" />
                                    </div>
                                </div>
                                <div className="chat-icon-and-text">
                                    <div className="chat-icon-container">
                                        <img src={chatIcon} alt="" />
                                    </div>
                                    <div className="user-name-text">
                                        <p>Message</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>)
    }
}

export default RenderAllUsers;