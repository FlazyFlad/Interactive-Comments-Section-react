import { useState, useEffect } from "react";

import "../style.css"
import { commentPostedTime } from "../time";

const Reply = ({
  commentData,
  updateScore,
  addNewReply,
  editComment,
  deleteComment,
  setDeleteModalState,
}) => {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(commentData.content);
  const [deleting, setDeleting] = useState(false);

  // adding reply
  const addReply = (newReply) => {
    addNewReply(newReply);
    setReplying(false);
  };

  const commentContent = () => {
    const text = commentData.content.trim().split(" ");
    const firstWord = text.shift().split(",");

    return !editing ? (
      <div className="comment-content">
        <span className="reply-to">{firstWord}, </span>
        {text.join(" ")}
      </div>
    ) : (
      <textarea
        className="content-edit-box"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
    );
  };

  const updateComment = () => {
    editComment(content, commentData.id, "reply");
    setEditing(false);
  };

  // delete comment
  const deleteReply = () => {
    deleteComment(commentData.id, "reply");
    setDeleting(false);
  };

  const cancelDelete = () => {
    setDeleting(false);
    setDeleteModalState(false);
  };

  const deleteBtnClick = () => {
    deleteReply();
    setDeleteModalState(false);
  };


  //commentvotes.js
  const [score, setScore] = useState(commentData.score);
  const [voted, setVoted] = useState(commentData.voted ?? false);
  let upVote = () => {
    if (commentData.currentUser) return;
    if (voted === false) {
      let n = score + 1;
      setScore(n);
      updateScore(n, commentData.id, "reply", "upvote");
      setVoted(true);
    }
  };

  let downVote = () => {
    if (commentData.currentUser) return;
    if (voted === true) {
      let n = score - 1;
      setScore(n);
      updateScore(n, commentData.id, "reply", "downvote");
      setVoted(false);
    }
  };

  //component header
  const [time, setTime] = useState("");
  const createdAt = new Date(commentData.createdAt);
  const today = new Date();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const differenceInTime = today.getTime() - createdAt.getTime();
      setTime(commentPostedTime(differenceInTime));
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, []);


  //addcomment
  const replyingToUser = commentData.username ? `@${ commentData.username}, ` : "";
  const [comment, setComment] = useState(replyingToUser);

  const clickHandler = () => {
    if (comment === "" || comment === " ") return;

    const newComment = {
      id: Math.floor(Math.random() * 100) + 5,
      content: replyingToUser + comment.replace(replyingToUser, ""),
      createdAt: new Date(),
      score: 0,
      username: "juliusomo",
      currentUser: true,
      replies: [],
    };

    addReply(newComment);
    setComment("");
  };


    //CommentBtn
    const showAddComment = () => {
      setReplying(!replying);
    };
  
    // delete comment
    const showDeleteModal = () => {
      setDeleting(true);
      setDeleteModalState(true);
    };
  
    // edit comment
    const showEditComment = () => {
      setEditing(true);
    };

  return (
    <div
      className={`comment-container ${
        commentData.replies[0] !== undefined ? "gap" : ""
      }`}
    >
      <div className="comment container">
        <div className="c-score">
          <img src="images/icon-plus.svg" alt="plus" className="score-control score-plus" onClick={upVote} />
          <p className="score-number">{commentData.score}</p>
          <img src="images/icon-minus.svg" alt="minus" className="score-control score-minus" onClick={downVote}/>
        </div>
        <div className="c-controls">
          {commentData.username === "juliusomo" && (
          <>
          <a href="/#" onClick={showDeleteModal} className="reply"><img src="images/icon-delete.svg" alt="" className="control-icon" />Delete</a>
          <a href="/#" onClick={showEditComment} className="reply"><img src="images/icon-edit.svg" alt="" className="control-icon" />Edit</a>
          </>
          )}
          {commentData.username !== "juliusomo" && (
          <a href="/#" onClick={showAddComment} className="reply"><img src="images/icon-reply.svg" alt="" className="control-icon" />Reply</a>
          )}
        </div>
        <div className="c-user">
          
          <img src={`images/avatars/image-${commentData.username}.png`}
          alt="" className="usr-img" />
          <p className="usr-name">{commentData.username}</p>
          {commentData.currentUser ? <div className="you-tag">you</div> : ""}
          <p className="cmnt-at">{`${time} ago`}</p>    
        </div>
        {commentContent()}
          {editing && (
            <button className="update-btn" onClick={updateComment}>
              update
            </button>
          )}
      </div>

      {replying && (
        //AddComent
        <div className="reply-input container">
          <img src="images/avatars/image-juliusomo.webp" alt="" className="usr-img" />
          <textarea className="cmnt-input" 
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          ></textarea>
          <button onClick={clickHandler} className="update-btn">{"reply"}</button>
        </div>
      )}
      {commentData.replies.map((reply) => (
        <Reply key={reply.id} commentData={reply} addReply={addReply} />
      ))}

      {deleting && (
        <div className="modal-wrp">
        <div className="modal container">
          <h3>Delete comment</h3>
          <p>Are you sure you want to delete this comment? This will remove the comment and cant be undone</p>
          <button className="yes" onClick={deleteBtnClick}>YES,DELETE</button>
          <button className="no" onClick={cancelDelete}>NO,CANCEL</button>
        </div>
      </div>
      )}
    </div>
  );
};

export default Reply;
