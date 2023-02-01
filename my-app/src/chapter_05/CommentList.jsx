import React from "react";
import Comment from "./Comment";

const comments = [
    {
        name:"강채련",
        comment: "안녕하세요",
    },
    {
        name:"이도겸",
        comment: "행복은 성적순이 아니라",
    },
    {
        name:"부승관",
        comment: "부석순~!",
    },

];

function CommentList(props) {
    return (
        <div>
            {comments.map((comment) => {
                return (
                    <Comment name={comment.name} comment={comment.comment}/>
                );
                })}
        </div>
    );
}

export default CommentList;