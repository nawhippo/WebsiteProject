import React, { useState } from 'react';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
const ReactionButtons = ({ user, postId, posterId, commentId }) => {
  const [reactionState, setReactionState] = useState('None');
  const [localLikesCount, setLocalLikesCount] = useState(0);
  const [localDislikesCount, setLocalDislikesCount] = useState(0);

  const updateReactionOnServer = async (reactorId, posterId, postId, commentId, action) => {
    const url = `/api/post/${reactorId}/${posterId}/${postId}/${commentId}/updateReactionComment`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    if (response.ok) {
      const updatedComment = await response.json();
      return updatedComment;
    } else {
      return null;
    }
  };

  const handleButtonClick = async (newReaction) => {
    const updatedComment = await updateReactionOnServer(user.appUserID, posterId, postId, commentId, newReaction);
    if (updatedComment) {
      if (newReaction === reactionState) {
        setReactionState('None');
      } else {
        setReactionState(newReaction);
      }
      setLocalLikesCount(updatedComment.likesCount);
      setLocalDislikesCount(updatedComment.dislikesCount);
    }
  };

  return (
    <div>
      <p>Likes: {localLikesCount} Dislikes: {localDislikesCount}</p>
      <ThumbUpOffAltIcon onClick={() => handleButtonClick('Like')}/>
      <ThumbDownOffAltIcon onClick={() => handleButtonClick('Dislike')} />
    </div>
  );
};

export default ReactionButtons;