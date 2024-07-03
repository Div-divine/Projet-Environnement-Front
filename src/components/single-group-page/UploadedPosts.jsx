import { useState, useEffect } from "react";
import GetAllPosts from "../../api/GetPostsAndUser";
import { formatDistanceToNow } from "date-fns";
import frLocale from 'date-fns/locale/fr'; // Import the French locale statically
import '../../style/PostsStyle.css';
import incognitoIcon from '../../assets/incognito.svg';
import messageIcon from '../../assets/message-regular.svg';
import userIcon from '../../assets/user-profile.svg';
import insertPostComment from "../../api/CreatePostCommentsApi";
import getPostCommentsAndSender from "../../api/GetPostCommentsApi";
import { useLocation, Link } from "react-router-dom";
import DeletePostAndComments from "../../api/DeletePostWithCommentsApi";
import updateUserPost from "../../api/UpdatePostApi";
import DeleteUserComments from "../../api/DeleteCommentsApi";
import updateUserComment from "../../api/UpdateUserCommentApi";
import DisplayIncognitoPopover from './IncognitoPostPopover';
import DisplayPopover from "../rules-popover/DisplayPopOver";
import ScaleItem from "../scale-items-with-motion/Framer-motion";
import insertUserPostIntoGroup from "../../api/CreateUserPostIngroupApi";
import insertUserPostIncognito from "../../api/CreateIncognitoPostApi";
import getUserDataById from "../../api/GetUserDataByIdApi";
import { useParams } from "react-router-dom";
import singleGroupData from "../../api/SingleGroupDataApi";
import { generateNonce } from "../../generate-nonce/nonce";
import { useCsrf } from "../../context/CsrfContext";



const DisplayUploadedPosts = ({ groupId }) => {
    const csrfToken = useCsrf()
    const nonce = generateNonce()
    // Define a state to track whether the post is incognito
    const [isIncognito, setIsIncognito] = useState(false);
    const [existPost, setExistPost] = useState(false);
    const [posts, setPosts] = useState(null);
    const [post, setPost] = useState('');
    // Access the id parameter from the URL
    const { id } = useParams();
    const [firstParamsId, setFirstParamsId] = useState(null)
    const [uuidParamsId, setUuidParamsId] = useState(null)
    const [groupData, setGroupData] = useState(null);
    // Remove white spaces and special characters from post
    const [unauthorizedPost, setUnauthorizedPost] = useState(false);
    const postWithoutSpecialCharaters = post.replace(/[^\w\s]/gi, '').trim()
    const [connectedUserData, setConnectedUserData] = useState(null);
    const [formattedDates, setFormattedDates] = useState([]); // Use an array for multiple dates
    const [formattedComentsDates, setFormattedCommentsDates] = useState([]); // Use an array for multiple dates
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

    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';

    useEffect(() => {
        if (id) {
            const firstId = id.slice(0, 1);
            const intoNum = +firstId;
            const secondId = id.slice(1)
            console.log('group uuid:', secondId, 'groupId:', firstId)
            setUuidParamsId(secondId)
            setFirstParamsId(intoNum);
        }
    }, [id])

    useEffect(() => {
        if (firstParamsId && csrfToken) {
            async function getGroupData(id, csrf) {
                const response = await singleGroupData(id, csrf);
                console.log('group data response are :', response);
                setGroupData(response);
            }
            getGroupData(firstParamsId, csrfToken);
        }
    }, [firstParamsId, csrfToken])

    const postContainer = document.querySelectorAll('.post-text-container');

    function handleIncognito() {
        setIsIncognito(!isIncognito);
    };

    // Handle submission of posts
    const submitPost = async (e) => {
        e.preventDefault();
        try {
            // Check if post, groupId, and userId are available
            if (post && groupData && userId && csrfToken) {

                if (postWithoutSpecialCharaters.length > 0) {
                    const postData = {
                        postContent: post.trim(),
                        groupId: groupData.group_id,
                        userId
                    };
                    if (!isIncognito) {
                        await insertUserPostIntoGroup(postData, csrfToken);
                    } else {
                        await insertUserPostIncognito(postData, csrfToken);
                    }
                    getGroupPosts(groupData.group_id, csrfToken);
                    // Reset post
                    setPost('');
                    // Unckeck the check box once the post having an incognito state is submitted
                    setIsIncognito(false);

                } else {
                    setUnauthorizedPost(true);
                }
            } else {
                // Handle the case where post, groupId, or userId is not available
                console.error('One or more required fields are missing');
            }
        } catch (error) {
            // Handle errors
            console.error('Uploading post failed:', error);
        }
    };

    useEffect(() => {
        if (userId && csrfToken) {
            async function getUserData(id, csrf) {
                const response = await getUserDataById(id, csrf);
                setConnectedUserData(response.user);
                console.log('Connected user in group is:', response)
            }
            getUserData(userId, csrfToken)
        }
    }, [userId, csrfToken]);

    const handleChange = (e) => {
        setPost(e.target.value);
    }

    useEffect(() => {
        if (firstParamsId && csrfToken) {
            async function getGroupData(id, csrf) {
                const response = await singleGroupData(id, csrf);
                console.log('group data response are :', response);
                setGroupData(response);
            }
            getGroupData(firstParamsId, csrfToken);
        }
    }, [firstParamsId, csrfToken])

    useEffect(() => {
        if (groupId && csrfToken) {
            const getData = async (id, csrf) => {
                const response = await GetAllPosts(id, csrf);
                console.log('Posts from group are: ', response);
                setPosts(response);
            }
            getData(groupId, csrfToken)
        }
    }, [groupId, csrfToken]);

    // Get all posts
    function getGroupPosts(groupId, csrfToken) {
        if (groupId && csrfToken) {
            const getData = async (id, csrf) => {
                const response = await GetAllPosts(id, csrf);
                console.log('Posts from group are: ', response);
                setPosts(response);
            }
            getData(groupId, csrfToken)
        }
    }

    // Remove unauthorized message once post content is changed
    useEffect(() => {
        if (post && postWithoutSpecialCharaters.length > 0) {
            setUnauthorizedPost(false);
        }
    }, [post]);

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

        if (userId && csrfToken) {
            const insertPost = async (msg, post, user, csrf) => {
                // Remove special characters except parentheses, brackets, and exclamation marks preceded by a letter
                const cleanedMsg = msg.replace(/[^\w\s]/gi, '').trim()
                if (cleanedMsg.length > 0) {
                    const userPostComment = {
                        commentMsg: msg.trim(),
                        postId: post,
                        userId: user
                    }
                    await insertPostComment(userPostComment, csrf);
                    await fetchComments();
                }
            }
            insertPost(msg[postId], postId, userId, csrfToken);
        }
        // Clear the message for the specific post after submitting
        setMsg(prevState => ({
            ...prevState,
            [postId]: ''
        }));
    }

    // Function to fetch comments
    const fetchComments = async () => {
        console.log("Fetching comments...");
        const fetchedComments = {};
        if (posts && csrfToken) {
            for (const post of posts) {
                const postId = post.post_id;
                const comments = await getPostCommentsAndSender(postId, csrfToken);
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

    const deletePost = (postUserId, postId, groupId, csrf) => {
        if (postUserId && postId && groupId, csrf) {
            const deleteUserPost = async (id, postAuth, csrf) => {
                await DeletePostAndComments(id, postAuth, csrf);
            }

            deleteUserPost(postId, postUserId, csrf);
            getGroupPosts(groupId, csrf);
        }
    };

    // Submit form (textarea value) once Enter is clicked on keyboard and set the updated value
    const handleKeyPress = async (event, postId, updateValue, userId) => {
        if (event.key === 'Enter' && csrfToken) {
            event.preventDefault();
            try {
                const values = Object.values(updateValue);
                const newUpdate = values[0].replace(/[^\w\s]/gi, '').trim();
                if (values.length > 0 && postId && newUpdate.length > 0 && userId) {
                    await updateUserPost(postId, userId, { postContent: values[0].trim() }, csrfToken);
                    setUpdateValue(prevState => ({
                        ...prevState,
                        [postId]: ''
                    }));
                    setIsUpdate(false);
                    getGroupPosts(groupData.group_id, csrfToken); // Fetch the updated posts
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

    async function deleteComment(commentId, userId, csrf) {
        if (userId && csrf && commentId) {
            await DeleteUserComments(commentId, userId, csrf);
            await fetchComments();
        }
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

    async function keyPressUpdateComment(event, commentId, updateCommentValue, userId, csrfToken) {
        if (event.key === 'Enter') {
            event.preventDefault();
            try {
                const values = Object.values(updateCommentValue);
                const newUpdate = values[0].replace(/[^\w\s]/gi, '').trim()
                if (values.length > 0 && commentId && newUpdate.length > 0 && userId && csrfToken) {
                    await updateUserComment(commentId, userId, { updateContent: values[0].trim() }, csrfToken);
                    setCommentUpdateValue(prevState => ({
                        ...prevState,
                        [commentId]: ''
                    }));
                    setCommentUpdatestate(false);
                    await fetchComments();
                    window.location.reload()
                }
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        }
    }

    useEffect(() => {
        if (posts) {
            setExistPost(true);
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
            {unauthorizedPost && <div className='unauthorised-container'>Post Non authorisé !</div>}
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
                        {connectedUserData && <img src={(connectedUserData.user_img && connectedUserData.show_user_image ? `${imgUrl}/${connectedUserData.user_img}` : userIcon)} alt="User image" />}
                    </div>
                    <div className='post-input-field-container'>
                        <form onSubmit={submitPost}>
                            <textarea type="text-area" placeholder="Faire un post..." value={post} onChange={handleChange} className='form-control' rows="3" />
                            {post && <div className='posts-submit-btn'><input type="submit" value='Uploader' /></div>}
                        </form>
                    </div>
                </div>
            </div>
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
                                <div className="post-user-img-container">{!posts[index].incognito && !posts[index].post_user_quit ?
                                    <img src={(posts[index].user_img && posts[index].show_user_image ?
                                        `${imgUrl}/${posts[index].user_img}` :
                                        userIcon)} alt="" />
                                    : <img src={incognitoIcon} alt="" />}</div>
                                <div className="post-date-container">
                                    <div>{!posts[index].incognito ? (!posts[index].post_user_quit ?
                                        posts[index].user_name : 'L\'auteur du post a quitté le groupe') :
                                        'Utilisateur Incognito'}</div> {/* Display the user name */}
                                    <div>{formattedDate}</div> {/* Display the formatted date */}
                                </div>
                            </div>
                            <div className="post-contents-container" style={{ whiteSpace: 'pre-line' }} nonce={nonce}>
                                {/* Render different content based on whether the post is being edited */}
                                {userId && posts[index].user_id == userId && posts[index].post_id == postIdBeingEdited && isUpdate ? (
                                    <div className="update-text-area-container">
                                        <textarea
                                            value={updateValue[posts[index].post_id] || ''}
                                            onChange={(event) => setUpdateValue(prevState => ({
                                                ...prevState,
                                                [posts[index].post_id]: event.target.value
                                            }))}
                                            onKeyPress={(event) => handleKeyPress(event, posts[index].post_id, updateValue, userId)}
                                            className="update-text-area"
                                        />
                                        <span>Pour annuler, cliquer échap ou </span>
                                        <Link className="cancel-post-update" onClick={cancelUpdate}>Annuler</Link>
                                        <span>. Pour valider cliquer </span>
                                        <Link className="validate-update-text">Entrée</Link>
                                        <span> Sur votre clavier</span>
                                    </div>
                                ) : (
                                    // If the post is not being edited, render its content
                                    <div>
                                        <div className={`post-text-container post-num-${posts[index].post_id}`}>{posts[index].post_content}</div>
                                        {/* Check if post content height is greater than 59px  to display afficher tout and reduire div*/}
                                        {postContainer[index] && postContainer[index].offsetHeight > 59 && <div className="display-all-text-main-container">
                                            {!expandedPosts[posts[index].post_id] ?
                                                <div className="display-all-post-content">
                                                    <span onClick={() => displayAllPostContent(posts[index].post_id)}>Tout afficher...</span>
                                                </div>
                                                : <div className="display-all-post-content">
                                                    <span onClick={() => ReduicePostContent(posts[index].post_id)}>Reduire</span>
                                                </div>}
                                        </div>}
                                    </div>
                                )}
                                {csrfToken && posts[index].user_id && posts[index].user_id == userId && <div className="edit-and-delete-post-container">
                                    <Link className="edit-post-text" onClick={(e) => updatePost(posts[index].post_id, posts[index].post_content)}>Editer</Link>
                                    <Link className="delete-post-text" onClick={(e) => deletePost(posts[index].user_id, posts[index].post_id, posts[index].group_id, csrfToken)}>Supprimer</Link>
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
                                        {!comment.mask_comment_user ? <img src={(comment.user_img && comment.show_user_image ? `${imgUrl}/${comment.user_img}` : userIcon)} alt="comment use image" /> : <img src={incognitoIcon} alt="" />}
                                    </div>
                                    <div className="comment-text-and-user-name-conatiner">
                                        <div className="user-commented-name">{!comment.mask_comment_user ? comment.user_name : 'L\'auteur de ce commentaire a quitté le group'}</div>
                                        <div>{comment.comment_created}</div>
                                        {/* Edit comment field */}
                                        {userId == comment.user_id && commentIdBeingEdited == comment.comment_id && commentUpdatestate && (
                                            <div className="update-comment-form-container">
                                                {userId && csrfToken && <form>
                                                    <textarea
                                                        value={commentUpdateValue[comment.comment_id] || ''}
                                                        onChange={(e) => setCommentUpdateValue(prevState => ({
                                                            ...prevState,
                                                            [comment.comment_id]: e.target.value
                                                        }))}
                                                        onKeyPress={(e) => keyPressUpdateComment(e, comment.comment_id, commentUpdateValue, userId, csrfToken)}
                                                    />
                                                </form>}
                                            </div>
                                        )}

                                        {commentIdBeingEdited != comment.comment_id && <div className="comment-msg">{comment.comment_msg}</div>}
                                        <div className="comment-edit-and-delete-container">
                                            {/* Allow editing only if userId matches comment.user_id */}
                                            {userId == comment.user_id && (
                                                <Link className="edit-post-text comment-edit" onClick={() => updateComment(comment.comment_id, comment.comment_msg)}>Editer</Link>
                                            )}
                                            {/* Allow deletion if userId matches post.user_id or if userId matches comment.user_id */}
                                            {userId && csrfToken && (userId == posts[index].user_id || userId == comment.user_id) && (
                                                <Link className="delete-post-text comment-edit" onClick={() => deleteComment(comment.comment_id, userId, csrfToken)}>Supprimer</Link>
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
