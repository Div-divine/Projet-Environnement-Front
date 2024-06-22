import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/FriendsStyle.css';
import GetAllUserFriends from '../../api/GettingUserFriendsApi';
import SideBar from '../Menus/SideBarMenu';
import userWithAddedGroups from '../../api/UserWithGroupsApi';
import existsChatroom from '../../api/ExistChatRoomApi';
import chatRoom from '../../api/creatingChatRoomApi';
import CustomModal from '../modalbox/CustomModalBox';
import deleteFriends from '../../api/DeleteUserFriendApi';
import DisplayConnectedSmallMenu from '../Menus/DisplaySmallScreenConnectedMenu';
import userIcon from '../../assets/user-profile.svg';
import useUserData from '../../api/UserInfoApi';
import { useCsrf } from '../../context/CsrfContext';

const FriendsPage = () => {
  const csrfToken = useCsrf(); // Access CSRF token from context
  const navigate = useNavigate()
  const [freindsId, setFriendsId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [friendsData, setFriendsData] = useState(null);
  const [clickedUserId, setClickedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = useUserData()
  // Image url from the back
  const imgUrl = 'http://localhost:3000/assets';
  
  useEffect(()=>{
    if(userData){
      setUserId(userData.user_id)
    }
  },[userData]);
  
  const ClickHandler = async (userClickedId) => {
    setClickedUserId(userClickedId);

    if (userId && userClickedId && csrfToken) {
      try {
        const chatroomIdData = await existsChatroom(userId, userClickedId, csrfToken);
        if (chatroomIdData && chatroomIdData.chatroom_id) {
          localStorage.setItem('user1', userId);
          localStorage.setItem('user2', userClickedId);
          navigate('/chat');
        } else {
          const usersToConnect = { user1Id: userId, user2Id: userClickedId };
          await chatRoom(usersToConnect, csrfToken);
          localStorage.setItem('user1', userId);
          localStorage.setItem('user2', userClickedId);
          navigate('/chat');
        }
      } catch (error) {
        console.error('Error handling user click:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (userId) => {
    setClickedUserId(userId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userId && clickedUserId && csrfToken) {
      try {
        await deleteFriends(userId, clickedUserId, csrfToken);
        console.log('Delete action confirmed for user ID:', clickedUserId);
        setIsModalOpen(false);
        window.location.reload();
        // Optionally, update friends list or UI to reflect deletion
      } catch (error) {
        console.error('Error deleting friend:', error);
      }
    }
  };

  useEffect(() => {
    if (clickedUserId) {
      console.log('User to delete:', clickedUserId);
    }
  }, [clickedUserId]);


  useEffect(() => {
    if (userId && csrfToken) {
      const getFriends = async (id, csrf) => {
        const response = await GetAllUserFriends(id, csrf);
        console.log('User friends are:', response);
        setFriendsId(response);
      };
      getFriends(userId, csrfToken);
    }
  }, [userId, csrfToken]);

  useEffect(() => {
    if (freindsId && csrfToken) {
      const getFriendsData = async (ids, csrf) => {
        try {
          const promises = ids.map(async (friend) => {
            const response = await userWithAddedGroups(friend.user_id, csrf);
            return response.data;
          });
          const friendData = await Promise.all(promises);
          setFriendsData(friendData);
        } catch (error) {
          console.error("Error fetching friends data:", error);
        }
      };
      getFriendsData(freindsId, csrfToken);
    }
  }, [freindsId, csrfToken]);

  useEffect(() => {
    if (friendsData) {
      console.log('Friend data is:', friendsData);
    }
  }, [friendsData]);

  return (
    <div className="group-page-container">
      <SideBar />
      <main className='main-elements'>
        <DisplayConnectedSmallMenu />
        {friendsData && <div className='small-screnn-nmb-of-frineds'>Total amis: {friendsData.length}</div>}
        <div className='friend-group-inner-container friends-upper-container user-listing-overall-container'>
          {friendsData && friendsData.length != 0 ? friendsData.map((user, userIndex) => {
            let userImageDisplayed = false;
            return (
              <div key={userIndex}>
                {user.map((innerData, index) => {
                  const userImage = !userImageDisplayed && (
                    <div key={`img-${userIndex}`} className='img-name-and-btn-container'>
                      <div className='img-and-name-container'>
                        <div className='img-container'>
                          <img src={(innerData.user_img && innerData.show_user_image ? `${imgUrl}/${innerData.user_img}` : userIcon)} alt="" className='popover-img' />
                        </div>
                        <div className='user-name-container'>{innerData.user_name}</div>
                      </div>
                      <div className='btns-container'>
                        <input type="button" value='Messagerie' className='message-button' onClick={() => ClickHandler(innerData.user_id)} />
                        <input type="button" value='Supprimer' className='delete-button' onClick={() => handleDeleteClick(innerData.user_id)} />
                      </div>
                      {innerData.group_name && <div className='member-group-title'>Membre de groups</div>}
                    </div>
                  );
                  userImageDisplayed = true;

                  return (
                    <div key={index}>
                      {userImage}
                      {innerData.group_name ? <div className='popover-groups-name'>- {innerData.group_name}</div> : <div className='popover-groups-name'>- Aucun group membre</div>}
                    </div>
                  );
                })}
              </div>
            );
          }) : <div className="unread-msg-and-users-container name-font no-message ">Aucun ami pour l'instant, veuillez en ajouter!</div>}
        </div>
      </main>
      {isModalOpen && clickedUserId && (
        <CustomModal
          title="Supprimer l'utilisateur de votre liste d'amis"
          message="Confirmer ?"
          buttonText="Supprimer"
          onClose={handleCloseModal}
          onButtonClick={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default FriendsPage;
