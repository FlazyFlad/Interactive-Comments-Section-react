import { useState, useEffect } from "react";

import "./style.css"

import Comment from "./components/Comment";

const App = () => {
  const [comments, updateComments] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState(false);

  const getData = async () => {
    const res = await fetch("./data/data.json");
    const data = await res.json();
    updateComments(data.comments);
  };

  useEffect(() => {
    localStorage.getItem("comments") !== null
      ? updateComments(JSON.parse(localStorage.getItem("comments")))
      : getData();
  }, []);

  useEffect(() => {
    if(comments.length !== 0){
    localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments]);

  // update score
  const updateScore = (score, id, type, method) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.score = score;
          data.voted = method === "upvote" ? true : false;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.score = score;
            data.voted = method === "upvote" ? true : false;
          }
        });
      });
    }
    updateComments(updatedComments);
  };

  // add comments
  const addComments = (newComment) => {
    const updatedComments = [...comments, newComment];
    updateComments(updatedComments);
  };

  // add replies
  const updateReplies = (replies, id) => {
    let updatedComments = [...comments];
    updatedComments.forEach((data) => {
      if (data.id === id) {
        data.replies = [...replies];
      }
    });
    updateComments(updatedComments);
  };

  // edit comment
  const editComment = (content, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.content = content;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.content = content;
          }
        });
      });
    }

    updateComments(updatedComments);
  };

  // delete comment
  let commentDelete = (id, type, parentComment) => {
    let updatedComments = [...comments];
    let updatedReplies = [];

    if (type === "comment") {
      updatedComments = updatedComments.filter((data) => data.id !== id);
    } else if (type === "reply") {
      comments.forEach((comment) => {
        if (comment.id === parentComment) {
          updatedReplies = comment.replies.filter((data) => data.id !== id);
          comment.replies = updatedReplies;
        }
      });
    }

    updateComments(updatedComments);
  };

    //addcomment
    const replyingToUser =  "";
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
  
      addComments(newComment);
      setComment("");
    };

  return (
    <main className="App">
      <div className="comment-section">
        <div className="comments-wrp">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          commentData={comment}
          updateScore={updateScore}
          updateReplies={updateReplies}
          editComment={editComment}
          commentDelete={commentDelete}
          setDeleteModalState={setDeleteModalState}
        />
      ))}
        </div>
      </div>
      
      {/* Add COmment COmp */}      
      <div className="comment-section">

      <div className="comments-wrp">

      </div> 
        <div className="reply-input container">
          <img src="images/avatars/image-juliusomo.webp" alt="" className="usr-img" />
          <textarea className="cmnt-input" placeholder="Add a comment..."             
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}></textarea>
          <button className="update-btn" onClick={clickHandler}>{"send"}</button>
        </div>
      </div>
    </main>
  );
};

export default App;
