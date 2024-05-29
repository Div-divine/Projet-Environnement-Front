import { useState, useEffect } from "react";
import GetAllPosts from "../../api/GetPostsAndUser";
import { formatDistanceToNow } from "date-fns";
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
import updateUserComment from "../../api/UpdateUserCommentApi";

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
    const [commentUpdatestate, setCommentUpdatestate] = useState(false);
    const [commentIdBeingEdited, setCommentIdBeingEdited] = useState(null);
    const [commentUpdateValue, setCommentUpdateValue] = useState({});
    const [expandedPosts, setExpandedPosts] = useState({});

    const postContainer = document.querySelectorAll('.post-text-container')


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

    // Get all posts
    function getGroupPosts(groupId) {
        if (groupId) {
            const getData = async (id) => {
                const response = await GetAllPosts(id);
                console.log('Posts from group are: ', response);
                setPosts(response);
            }
            getData(groupId)
        }
    }

    useEffect(() => {
        if (posts) {
            const formattedDates = posts.map((data) => {
                // Format the time difference for each post
                return formatDistanceToNow(new Date(data.post_created), { locale: frLocale, addSuffix: true, includeSeconds: true });
            });
            setFormattedDates(formattedDates);
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

    const submitMsg = async (e, postId, userId) => {
        e.preventDefault();

        if (userId) {
            const insertPost = async (msg, post, user) => {
                // Remove special characters except parentheses, brackets, and exclamation marks preceded by a letter
                const cleanedText = msg.replace(/(?!\b\w)!|[^\w\s\(\)\[\]]/gi, '').trim();
                const userPostComment = {
                    commentMsg: cleanedText,
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
        await fetchComments();
        window.location.reload();
    }

    // Function to fetch comments
    const fetchComments = async () => {
        console.log("Fetching comments...");
        const fetchedComments = {};
        if (posts) {
            for (const post of posts) {
                const postId = post.post_id;
                const comments = await getPostCommentsAndSender(postId);
                console.log("Comments for post", postId, ":", comments);
                fetchedComments[postId] = comments;
            }
            setComments(fetchedComments);
        }
    };

    const toggleCommentFormVisibility = (postId) => {
        setCommentFormsVisibility(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const deletePost = (postId, groupId) => {
        if (postId && groupId) {
            const deleteUserPost = async (id) => {
                await DeletePostAndComments(id);
            }

            deleteUserPost(postId);
            getGroupPosts(groupId);
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
                    await updateUserPost(postId, { postContent: values[0] });
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

    async function deleteComment(commentId) {
        await DeleteUserComments(commentId);
        await fetchComments();
    }

    function updateComment(commentId, value) {
        console.log('Comment id to update:', commentId);
        // Close the previously opened edit textarea if any
        setCommentIdBeingEdited((prevCommentId) => {
            if (prevCommentId === commentId) {
                return null;
            } else {
                return commentId;
            }
        });

        // Toggle the comment update state to show/hide the edit textarea
        setCommentUpdatestate((prevState) => !prevState);

        // Set the content for the current comment
        setCommentUpdateValue({ [commentId]: value });
    }

    useEffect(() => {
        if (commentUpdateValue) {
            const updateValue = Object.values(commentUpdateValue);
            console.log('Comment update value is:', updateValue[0]);

        }
    }, [commentUpdateValue]);

    async function keyPressUpdateComment(event, commentId, updateCommentValue) {
        if (event.key === 'Enter') {
            event.preventDefault();

            try {
                const values = Object.values(updateCommentValue);
                if (values.length > 0 && commentId) {
                    await updateUserComment(commentId, { updateContent: values[0] });
                    setCommentUpdateValue(prevState => ({
                        ...prevState,
                        [commentId]: ''
                    }));
                    setCommentUpdatestate(false);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        }
    }

    useEffect(() => {
        if (posts) {
            setExistPost(true);
            console.log('fetched comment in use effect ...');
            // Fetch comments when posts are available
            fetchComments();
        }
    }, [posts]);

    function displayAllPostContent(id) {
        if (id) {
            console.log('post to open id clicked:', id);
            setExpandedPosts(prevState => ({
                ...prevState,
                [id]: true
            }));

            const openPostContentElements = document.getElementsByClassName(`post-num-${id}`);

            for (let element of openPostContentElements) {
                element.style.maxHeight = 'none';
                element.style.overflow = 'auto';
            }
        }
    }

    function ReduicePostContent(id) {
        if (id) {
            console.log('post to open id clicked:', id);
            setExpandedPosts(prevState => ({
                ...prevState,
                [id]: false
            }));

            const openPostContentElements = document.getElementsByClassName(`post-num-${id}`);

            for (let element of openPostContentElements) {
                element.style.maxHeight = '60px';
                element.style.overflow = 'hidden';
            }
        }
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
                                {posts[index].user_id == userId && posts[index].post_id == postIdBeingEdited && isUpdate ? (
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
                                    <div>
                                        <div className={`post-text-container post-num-${posts[index].post_id}`}>{posts[index].post_content}</div>
                                        {/* Check if post content height is greater than 59px  to display afficher tout and reduire div*/}
                                        {postContainer[index] && postContainer[index].offsetHeight > 59 && <div className="display-all-text-main-container">
                                            {!expandedPosts[posts[index].post_id] ?
                                                <div className="display-all-post-content"><span onClick={() => displayAllPostContent(posts[index].post_id)}>Tout afficher...</span></div>
                                                : <div className="display-all-post-content"><span onClick={() => ReduicePostContent(posts[index].post_id)}>Reduire</span></div>}
                                        </div>}
                                    </div>
                                )}
                                {posts[index].user_id == userId && <div className="edit-and-delete-post-container">
                                    <Link className="edit-post-text" onClick={(e) => updatePost(posts[index].post_id, posts[index].post_content)}>Editer</Link>
                                    <Link className="delete-post-text" onClick={(e) => deletePost(posts[index].post_id, posts[index].group_id)}>Supprimer</Link>
                                </div>}
                            </div> {/* Display posts user content and ensure newlines */}

                            {posts[index].post_id && <div className="message-icon-and-text-upper" onClick={() => toggleCommentFormVisibility(posts[index].post_id)}>
                                {posts[index].post_id && <div className="message-icon-and-text-container">
                                    <div className="post-message-icon-container">
                                        <img src={messageIcon} alt="comment icon" />
                                    </div>
                                    {Array.isArray(comments[posts[index].post_id]) && comments[posts[index].post_id] ? <div className="comment-text-container text-center">{comments[posts[index].post_id].length} Commentaires</div>
                                        : <div className="comment-text-container text-center">Commentaires</div>}
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
                            {commentFormsVisibility[posts[index].post_id] && userId && Array.isArray(comments[posts[index].post_id]) && comments[posts[index].post_id].map(comment => (
                                <div key={comment.comment_id} className="comment-container mt-3">
                                    <div className="comment-user-img">
                                        <img src={`../../src/${comment.user_img}`} alt="comment use image" />
                                    </div>
                                    <div className="comment-text-and-user-name-conatiner">
                                        <div className="user-commented-name">{comment.user_name}</div>
                                        {/* Edit comment field */}
                                        {userId == comment.user_id && commentIdBeingEdited == comment.comment_id && commentUpdatestate && (
                                            <div className="update-comment-form-container">
                                                <form>
                                                    <textarea
                                                        value={commentUpdateValue[comment.comment_id] || ''}
                                                        onChange={(e) => setCommentUpdateValue(prevState => ({
                                                            ...prevState,
                                                            [comment.comment_id]: e.target.value
                                                        }))}
                                                        onKeyPress={(e) => keyPressUpdateComment(e, comment.comment_id, commentUpdateValue)}
                                                    />
                                                </form>
                                            </div>
                                        )}

                                        {commentIdBeingEdited != comment.comment_id && <div className="comment-msg">{comment.comment_msg}</div>}
                                        <div className="comment-edit-and-delete-container">
                                            {/* Allow editing only if userId matches comment.user_id */}
                                            {userId == comment.user_id && (
                                                <Link className="edit-post-text comment-edit" onClick={() => updateComment(comment.comment_id, comment.comment_msg)}>Editer</Link>
                                            )}
                                            {/* Allow deletion if userId matches post.user_id or if userId matches comment.user_id */}
                                            {(userId == posts[index].user_id || userId == comment.user_id) && (
                                                <Link className="delete-post-text comment-edit" onClick={() => deleteComment(comment.comment_id)}>Supprimer</Link>
                                            )}
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
