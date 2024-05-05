import { useState, useEffect } from "react";
import GetAllPosts from "../../api/GetPostsAndUser";
import { formatDistanceToNow, differenceInMilliseconds } from "date-fns";
import frLocale from 'date-fns/locale/fr'; // Import the French locale statically
import '../../style/PostsStyle.css';
import incognitoIcon from '../../assets/svg/incognito.svg';
import messageIcon from '../../assets/svg/message-regular.svg';
import insertPostComment from "../../api/CreatePostCommentsApi";
import getPostCommentsAndSender from "../../api/GetPostCommentsApi";
import { useLocation, Link } from "react-router-dom";
import DeletePostAndComments from "../../api/DeletePostWithCommentsApi";
import updateUserPost from "../../api/UpdatePostApi";
import DeleteUserComments from "../../api/DeleteCommentsApi";

const DisplayUploadedPosts = ({ groupId }) => {
    const [existPost, setExistPost] = useState(false);
    const [posts, setPosts] = useState(null);
    const [formattedDates, setFormattedDates] = useState([]); // Use an array for multiple dates
    const [msg, setMsg] = useState({});
    const userId = localStorage.getItem('userId');
    const [comments, setComments] = useState({});
    const [commentFormsVisibility, setCommentFormsVisibility] = useState({});
    const location = useLocation();
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateValue, setUpdateValue] = useState({});
    const [postIdBeingEdited, setPostIdBeingEdited] = useState(null);

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
        if (userId) {
            const insertPost = async (msg, post, user) => {
                const userPostComment = {
                    commentMsg: msg,
                    postId: post,
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
        window.location.reload();

    }

    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = {};
            for (const post of posts) {
                const postId = post.post_id;
                const comments = await getPostCommentsAndSender(postId);
                fetchedComments[postId] = comments;
            }
            setComments(fetchedComments);
        };
        if (posts) {
            fetchComments();
        }
    }, [posts]);

    const toggleCommentFormVisibility = (postId) => {
        setCommentFormsVisibility(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const deletePost = (postId) => {
        if (postId) {
            const deleteUserPost = async (id) => {
                await DeletePostAndComments(id);
            }

            deleteUserPost(postId);
            window.location.reload();
        }
    };

    // Submit form (textarea value) once Enter is clicked on keyboard and set the updated value
    const handleKeyPress = async (event, postId, updateValue) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            try {
                const values = Object.values(updateValue);
                if (values.length > 0 && postId) {
                    console.log('Data updated successfully  in keypress:', values[0], 'Of post:', postId);
                    await updateUserPost(postId, { postContent: values[0] })
                    setUpdateValue(prevState => ({
                        ...prevState,
                        [postId]: ''
                    }));
                    setIsUpdate(false);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
    };

    function updatePost(id, postContent) {
        setIsUpdate(true);
        // Check if the post is already being edited
        if (postIdBeingEdited === id) {
            // If it's already being edited, reset it
            setPostIdBeingEdited(null);
        } else {
            // Otherwise, set the postIdBeingEdited to the current post id
            setPostIdBeingEdited(id);
            // Also update the content for this post
            setUpdateValue(prevState => ({
                ...prevState,
                [id]: postContent
            }));
        }
    }

    // This resets the isUpdate to false once user clicked escape (échap) button on keyboard

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                setIsUpdate(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    // Set isUpdate to false if Annuler is also clicked

    function cancelUpdate() {
        setIsUpdate(false);
    }

    async function deleteComment(commentId){
            await DeleteUserComments(commentId);
            window.location.reload();
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
                                {/* Render different content based on whether the post is being edited */}
                                {posts[index].user_id == userId && posts[index].post_id === postIdBeingEdited && isUpdate ? (
                                    <div className="update-text-area-container">
                                        <textarea
                                            value={updateValue[posts[index].post_id] || ''}
                                            onChange={(event) => setUpdateValue(prevState => ({
                                                ...prevState,
                                                [posts[index].post_id]: event.target.value
                                            }))}
                                            onKeyPress={(event) => handleKeyPress(event, posts[index].post_id, updateValue)}
                                            className="update-text-area"
                                        />
                                        <span>Pour annuler, cliquer échap ou </span><Link className="cancel-post-update" onClick={cancelUpdate}>Annuler</Link><span>. Pour valider cliquer </span><Link className="validate-update-text">Enter</Link><span> Sur votre clavier</span>
                                    </div>
                                ) : (
                                    // If the post is not being edited, render its content
                                    posts[index].post_content
                                )}
                                {posts[index].user_id == userId && <div className="edit-and-delete-post-container">
                                    <Link className="edit-post-text" onClick={(e) => updatePost(posts[index].post_id, posts[index].post_content)}>Editer</Link>
                                    <Link className="delete-post-text" onClick={(e) => deletePost(posts[index].post_id)}>Supprimer</Link>
                                </div>}
                            </div> {/* Display posts user content and ensure newlines */}

                            {posts[index].post_id && <div className="message-icon-and-text-upper" onClick={() => toggleCommentFormVisibility(posts[index].post_id)}>
                                {posts[index].post_id && <div className="message-icon-and-text-container">
                                    <div className="post-message-icon-container">
                                        <img src={messageIcon} alt="comment icon" />
                                    </div>
                                    <div className="comment-text-container text-center">Commenter</div>
                                </div>}
                            </div>}
                            {commentFormsVisibility[posts[index].post_id] && userId && <form onSubmit={(e) => submitMsg(e, posts[index].post_id, userId)}>
                                <textarea
                                    type="text-area"
                                    placeholder="Laissez un commentaire..."
                                    value={msg[posts[index].post_id] || ''}
                                    onChange={(e) => handleMsg(e, posts[index].post_id)}
                                    className='form-control message-text-area'
                                    rows="3"
                                />
                                {msg[posts[index].post_id] && (
                                    <div className='posts-submit-btn'>
                                        <input type="submit" value='Envoyer' />
                                    </div>
                                )}
                            </form>}
                            {/* Display comments for the current post */}
                            {Array.isArray(comments[posts[index].post_id]) && comments[posts[index].post_id].map(comment => (
                                <div key={comment.comment_id} className="comment-container mt-3">
                                    <div className="comment-user-img">
                                        <img src={`../../src/${comment.user_img}`} alt="" />
                                    </div>
                                    <div className="comment-text-and-user-name-conatiner">
                                        <div className="user-commented-name">{comment.user_name}</div>
                                        <div className="comment-msg">{comment.comment_msg}</div>
                                        <div className="comment-edit-and-delete-container">
                                            {userId == comment.user_id && <Link className="edit-post-text comment-edit" onClick={(e) => updatePost(posts[index].post_id, posts[index].post_content)}>Editer</Link>}
                                            {userId == posts[index].user_id && <Link className="delete-post-text comment-edit" onClick={(e) => deleteComment(comment.comment_id)}>Supprimer</Link>}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )
                ))}
            </div>
        </div>
    );

}

export default DisplayUploadedPosts;
