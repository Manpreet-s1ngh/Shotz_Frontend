import React from "react";
import "../css/commentComponent.css";

function CommentComponent({ currentComment }) {
  return (
    <div className="comment">
      <img
        className="commentUserPhoto"
        src={currentComment.user.profilePhoto}
        alt=""
      />

      <div className="commentInfo">
        <div className="commentUser">
          <p className="commentUserName"> {currentComment.user.name}</p>
          <p className="commentTime">
           
            {new Date(currentComment.createdAt).toLocaleString()}
          </p>
        </div>

        <p className="commentContent">
          {currentComment.content} ? {currentComment.content} : '--'
        </p>
      </div>
    </div>
  );
}

export default CommentComponent;
