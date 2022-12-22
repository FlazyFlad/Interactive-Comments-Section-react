import { useState, useEffect } from "react";

import "../style.css"

import Reply from "./Reply";


import { commentPostedTime } from "../time";

const Comment = ({
  commentData,
  updateScore,
  updateReplies,
  editComment,
  commentDelete,
  setDeleteModalState,
}) => {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(commentData.content);
  const [deleting, setDeleting] = useState(false);

  const addReply = (newReply) => {
    const replies = [...commentData.replies, newReply];
    updateReplies(replies, commentData.id);
    setReplying(false);
  };

  const updateComment = () => {
    editComment(content, commentData.id, "comment");
    setEditing(false);
  };

  const deleteComment = (id, type) => {
    const finalType = type !== undefined ? type : "comment";
    const finalId = id !== undefined ? id : commentData.id;
    commentDelete(finalId, finalType, commentData.id);
    setDeleting(false);
  };

  //delete.js

  const cancelDelete = () => {
    setDeleting(false);
    setDeleteModalState(false);
  };

  const deleteBtnClick = () => {
    deleteComment();
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
      updateScore(n, commentData.id, "comment", "upvote");
      setVoted(true);
    }
  };

  let downVote = () => {
    if (commentData.currentUser) return;
    if (voted === true) {
      let n = score - 1;
      setScore(n);
      updateScore(n, commentData.id, "comment", "downvote");
      setVoted(false);
    }
  };

  //comment header
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
        commentData.replies[0] !== undefined ? "reply-container-gap" : ""
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
          <a onClick={showDeleteModal} className="reply"><img src="images/icon-delete.svg" alt="" className="control-icon" />Delete</a>
          <a onClick={showEditComment} className="reply"><img src="images/icon-edit.svg" alt="" className="control-icon" />Edit</a>
          </>
          )}
          {commentData.username !== "juliusomo" && (
          <a onClick={showAddComment} className="reply"><img src="images/icon-reply.svg" alt="" className="control-icon" />Reply</a>
          )}
        </div>
        <div className="c-user">
          
          <img src={`images/avatars/image-${commentData.username}.png`}
          alt="" className="usr-img" />
          <p className="usr-name">{commentData.username}</p>
          {commentData.currentUser ? <div className="you-tag">you</div> : ""}
          <p className="cmnt-at">{`${time} ago`}</p>    
        </div>
        {!editing ? ( 
        <p className="c-text">
          <span className="c-body">{commentData.content}</span>
        </p>
          ) : (
            <textarea
              className="content-edit-box"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          )}
          {editing && (
            <button className="update-btn" onClick={updateComment}>
              update
            </button>
          )}
      </div>

  
      {replying && (
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
      {commentData.replies !== [] && (
        //ReplyContainer
        <>    
        <div className="replies comments-wrp">
        {commentData.replies.map((data) => (
          <Reply
            key={data.id}
            commentData={data}
            updateScore={updateScore}
            addNewReply={addReply}
            editComment={editComment}
            deleteComment={deleteComment}
            setDeleteModalState={setDeleteModalState}
          />
        ))}
      </div>
      </>
      )}

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

export default Comment;
