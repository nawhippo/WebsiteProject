import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../login/UserContext';
import { Link } from 'react-router-dom'; 
import CommentForm from '../comment/createComment';
import '../posts.css';

const PostsPage = () => {
  const { user } = useUserContext();
  const [targetUsername, setTargetUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [currentPostId, setCurrentPostId] = useState(null); 
  const [currentPosterId, setCurrentPosterId] = useState(null);
  const [allPostsData, setAllPostsData] = useState(null);


  
  const fetchData = (username) => {
    if(username){
    setIsLoading(true);
    fetch(`/api/post/${user.appUserID}/postsByUsername/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAllPostsData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  } else {
    setIsLoading(true);
    fetch(`/api/post/${user.appUserID}/posts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAllPostsData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }
}

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleSearchClick = () => {
    setTargetUsername(inputValue);
    fetchData(inputValue);
  };

  //set the current post ID when clicking the "Comment" button
  const handleCommentClick = (postId) => {
    setCurrentPostId(postId);
  };

  const handleLikeClickPost = (posterid, postid) => {
    fetch(`/api/post/${user.appUserID}/${posterid}/${postid}/addLike`, {
      method: "PUT",
    })
    .then((response) => {
      if (response.ok) {
        window.location.reload(false);
      } else {
        console.log("error disliking comment");
      }
    })
    .catch((error) => {
      
    });
  };
  
  const handleDislikeClickPost = (posterid, postid) => {
    fetch(`/api/post/${user.appUserID}/${posterid}/${postid}/addDislike`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload(false);
        } else {
          console.log("error disliking comment");
        }
      })
      .catch((error) => {
        
      });
  };
  
  const handleLikeClickComment = (posterid, postid, commentid) => {
    fetch(`/api/post/${user.appUserID}/${posterid}/${postid}/${commentid}/addLike`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          {/*cool */}
          window.location.reload(false);
        } else {
         console.log("error liking comment");
        }
      })
      .catch((error) => {
        // Handle fetch error
      });
  };
  
  const handleDislikeClickComment = (posterid, postid, commentid) => {
    fetch(`/api/post/${user.appUserID}/${posterid}/${postid}/${commentid}/addDislike`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload(false);
        } else {
          console.log("error disliking comment");
        }
      })
      .catch((error) => {
        // Handle fetch error
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>All Posts</h1>
      <input
        type="text"
        value={inputValue}
        placeholder="Enter username"
        onChange={handleInputChange}
      />
      <button onClick={handleSearchClick}>Search</button>
      {allPostsData && allPostsData.length > 0 ? (
        allPostsData.map((post) => (
          <div key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <p>Likes: {post.likes}      <button onClick={handleLikeClickPost(post.posterid, post.id)}>Like</button>
               Dislikes: {post.dislikes}   <button onClick={handleDislikeClickPost(post.posterid, post.id)}>Dislike</button></p>
            <p>{post.email}</p>
            <p>{post.dateTime}</p>
            <p>By: {post.posterusername}</p>
            <p>Comments:</p>
            {/* Use a callback function to pass the postId to the handler */}

            
            <button onClick={() => handleCommentClick(post.id)}>Comment</button>
            {/* Render the CommentForm only for the current post */}
            {currentPostId === post.id && <CommentForm postId={post.id} />}
            {post.commentList.map((comment) => (
              <div key={comment.id} className='comment'>
                <p>{comment.content}</p>
                <p>By: {comment.commenterUsername}</p>
               <p> Likes: {comment.likes}
               <button onClick={() => handleLikeClickComment(post.posterid, post.id, comment.id)}>like</button>
                Dislikes: {comment.dislikes}
               <button onClick={() => handleDislikeClickComment(post.posterid, post.id, comment.id)}>dislike</button> 
                </p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};
export default PostsPage;