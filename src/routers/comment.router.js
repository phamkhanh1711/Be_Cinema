const express = require("express");
const { createNewComment, replyComment, getAllCommentsOnPost,getPercentCommentSentiment } = require("../controller/comment.controller");


const commentRouter = express.Router();

// tao comment cho phim
commentRouter.route("/comment/:movieId").post(createNewComment)

// reply comment
// commentRouter.route("/:parentCommentId").post(replyComment)

// lay tat ca comment cua 1 phim
commentRouter.route("/:movieId").get(getAllCommentsOnPost)
commentRouter.route("/percent-sentiment/:movieId").get(getPercentCommentSentiment)
module.exports = {
  commentRouter,
};
