const express = require("express")

const { getAccessToRoute } = require("../Middlewares/Authorization/auth");

const { addNewCommentToBlog ,getAllCommentByBlog,commentLike ,getCommentLikeStatus} = require("../Controllers/comment")

const { checkBlogExist } = require("../Middlewares/database/databaseErrorhandler");

const router = express.Router() ;


router.post("/:slug/addComment",[getAccessToRoute,checkBlogExist] ,addNewCommentToBlog)

router.get("/:slug/getAllComment",getAllCommentByBlog)

router.post("/:comment_id/like",commentLike)

router.post("/:comment_id/getCommentLikeStatus",getCommentLikeStatus)


module.exports = router