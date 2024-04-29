import { useState, useEffect } from "react";
import GetAllPosts from "../../api/GetPostsAndUser";
import { formatDistanceToNow, differenceInMilliseconds } from "date-fns";
import frLocale from 'date-fns/locale/fr'; // Import the French locale statically
import '../../style/PostsStyle.css';
import incognitoIcon from '../../assets/svg/incognito.svg';
import messageIcon from '../../assets/svg/message-regular.svg';
import insertPostComment from "../../api/CreatePostCommentsApi";

const DisplayUploadedPosts = ({ groupId }) => {
    const [existPost, setExistPost] = useState(false);
    const [posts, setPosts] = useState(null);
    const [formattedDates, setFormattedDates] = useState([]); // Use an array for multiple dates
    const [msg, setMsg] = useState({});
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        if (groupId) {
            const getData = async (id) => {
                const response = await GetAllPosts(id);
                console.log('Posts from group are: ', response);
                setPosts(response);
            }
            getData(groupId)
        }
    }, [groupId]);

    useEffect(() => {
        if (posts) {
            const formattedDates = posts.map((data) => {
                // Format the time difference for each post
                return formatDistanceToNow(data.post_created, { locale: frLocale, addSuffix: true, includeSeconds: true });
            });
            setFormattedDates(formattedDates);
        }
    }, [posts]);

    useEffect(() => {
        if (posts) {
            setExistPost(true)
        }
    }, [posts]);

    const handleMsg = (e, postId) => {
        const newMsg = e.target.value;
        console.log('handle msg Post id is: ', postId);
        // Update the message for the specific post
        setMsg(prevState => ({
            ...prevState,
            [postId]: newMsg
        }));
    }

    const submitMsg = (e, postId, userId) => {
        e.preventDefault();
        if(userId){
            const insertPost = async (msg, post, user) =>{
                const userPostComment = {
                    commentMsg: msg,
                    postId : post,
                    userId: user
                }
                const response = await insertPostComment(userPostComment);
                return response;
            }
            insertPost(msg[postId], postId, userId);
        }
        // Clear the message for the specific post after submitting
        setMsg(prevState => ({
            ...prevState,
            [postId]: ''
        }));
    }

    return (
        <div>
            {!existPost && (
                <div className="no-post-in-group-text">
                    <p>Soyez celui à poser la première pierre d'un mouvement pour un avenir plus vert. Faites-y un post.</p>
                </div>
            )}
            <div className="posts-upper-container">
                {formattedDates.map((formattedDate, index) => (
                    posts && posts[index] && (
                        <div key={index} className="posts-display-inner-section">
                            <div className="posts-user-img-and-date-container">
                                <div className="post-user-img-container">{!posts[index].incognito ? <img src={`../../src/${posts[index].user_img}`} alt="" /> : <img src={incognitoIcon} alt="" />}</div>
                                <div className="post-date-container">
                                    <div>{!posts[index].incognito ? posts[index].user_name : 'Utilisateur Incognito'}</div> {/* Display the user name */}
                                    <div>{formattedDate}</div> {/* Display the formatted date */}
                                </div>
                            </div>
                            <div className="post-contents-container" style={{ whiteSpace: 'pre-line' }}>
                                {posts[index].post_content}
                            </div> {/* Display posts user content and ensure newlines */}

                            <div className="message-icon-and-text-upper">
                                {posts[index].post_id && <div className="message-icon-and-text-container">
                                    <div className="post-message-icon-container">
                                        <img src={messageIcon} alt="comment icon" />
                                    </div>
                                    <div className="comment-text-container text-center">Commentaire</div>
                                </div>}
                            </div>
                            {userId && <form onSubmit={(e) => submitMsg(e, posts[index].post_id, userId)}>
                                <textarea 
                                    type="text-area" 
                                    placeholder="Laissez un commentaire..." 
                                    value={msg[posts[index].post_id] || ''} 
                                    onChange={(e) => handleMsg(e, posts[index].post_id)} 
                                    className='form-control message-text-area' 
                                    rows="3" 
                                />
                                <div className='posts-submit-btn'>
                                    <input type="submit" value='Envoyer' />
                                </div>
                            </form>}

                        </div>
                    )
                ))}
            </div>
        </div>
    );

}

export default DisplayUploadedPosts;
