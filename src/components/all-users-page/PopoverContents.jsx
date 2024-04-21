import groupIcon from '../../assets/svg/teamspeak.svg';
import MsgIcon from '../../assets/svg/comment-solid.svg';
import '../../style/PopOverStyle.css';
import { Link } from 'react-router-dom';

const PopoverContents = ({ pathHandler, userNameHandler, groupHandler }) => {
    return <div className='popover-container'>
        <div className='popover-img-and-name-container'>
            <div className='popover-img-container'>
                <img src={pathHandler} alt="user" className='popover-img' />
            </div>
            <div className='popover-name-and-contents-container'>
                <div>
                    <p className='popover-user-name'>{userNameHandler}</p>
                </div>

                <div className='popover-group-icon-and-groups-container'>
                    <div className='popover-group-icon-container'>
                        <img src={groupIcon} alt="group icon" />
                    </div>
                    <div className='popover-groups-container mt-2'>
                        {groupHandler && groupHandler.length > 0 ?
                            groupHandler.map(group => (
                                <div className='popover-groups-name'>{group.group_name}</div>
                            ))
                            : <div><p className='popover-groups-name'>Aucun group</p></div>}
                    </div>
                </div>
            </div>
        </div>
        <div className='add-friend-and-msg-container'>
            <div>
                <input type="button" value="Ajouter aux amis" className='popover-add-friend-btn-container'/>
            </div>
            <div className='upper-container-icon-and-msg'>
                <Link className='msg-and-icon-container'>
                    <div className='msg-icon-container'>
                        <img src={MsgIcon} alt="" />
                    </div>
                    <div className='msg-container text-center'>
                        <p>Messagerie</p>
                    </div>
                </Link>
            </div>
        </div>
    </div>
}

export default PopoverContents;