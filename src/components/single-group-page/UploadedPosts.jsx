import { useState, useEffect } from "react";
import GetAllPosts from "../../api/GetPostsAndUser";
import { formatDistanceToNow, differenceInMilliseconds } from "date-fns";
import frLocale from 'date-fns/locale/fr'; // Import the French locale statically
import '../../style/PostsStyle.css';
import incognitoIcon from '../../assets/svg/incognito.svg';

const DisplayUploadedPosts = ({ groupId }) => {
    const [existPost, setExistPost] = useState(false);
    const [posts, setPosts] = useState(null);
    const [formattedDates, setFormattedDates] = useState([]); // Use an array for multiple dates

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
    }, [posts])

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
                        </div>
                    )
                ))}
            </div>
        </div>
    );
    
}

export default DisplayUploadedPosts;
