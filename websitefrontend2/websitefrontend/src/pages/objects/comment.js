import React, { useState } from 'react';
import {DeleteCommentButton} from "../../buttonComponents/deleteCommentButton/deleteCommentButton";
import ReactionButtons from "../../buttonComponents/reactCommentButtons/reactCommentButtons";
import ProfilePictureComponent from "../../buttonComponents/ProfilePictureComponent";
import { useUserContext } from "../usercontext/UserContext";

const Comment = ({ comment, updateComments }) => {
    const { user } = useUserContext();
    const [localLikes, setLocalLikes] = useState(comment.likesCount);
    const [localDislikes, setLocalDislikes] = useState(comment.dislikesCount);

    const handleUpdateLikesDislikes = (newLikes, newDislikes) => {
        setLocalLikes(newLikes);
        setLocalDislikes(newDislikes);
        updateComments(comment.id, newLikes, newDislikes);
    };

    return (
        <div key={comment.id} className='comment-container' style={{ width: '100%', margin: '15px 0', borderRadius: '20px', backgroundColor: 'lightgray' }}>
            <div className='comment-header' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ fontSize: '20px', marginLeft: '10px' }}>{comment.commenterusername}</p>
                <ProfilePictureComponent userid={comment.commenterid} style={{ width: '50px', height: '50px' }} />

            </div>
            <div className='comment-body' style={{ padding: '10px' }}>
                <p style={{ fontSize: '16px', margin: '0' }}>{comment.content}</p>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <ReactionButtons
                        commentId={comment.id}
                        updateLikesDislikes={handleUpdateLikesDislikes}
                        likesCount={localLikes}
                        dislikesCount={localDislikes}
                    />
                    {user && comment.commenterid === user.id &&
                        <DeleteCommentButton commentId={comment.id} />
                    }
                </div>
            </div>
        </div>
    );
};

export default Comment;