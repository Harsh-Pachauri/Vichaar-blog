const asyncErrorWrapper = require("express-async-handler")
const Blog = require("../Models/blog");
const Comment = require("../Models/comment");

const addNewCommentToBlog  =asyncErrorWrapper(async(req,res,next)=> {

    const {slug} = req.params 

    const {star , content } =req.body 

    const blog = await Blog.findOne({slug :slug })

    const comment = await Comment.create({

        blog :blog._id ,
        content :content ,
        author : req.user.id ,
        star:star 
    })

    blog.comments.push(comment._id)

    blog.commentCount = blog.comments.length

    await blog.save();

    return res.status(200).json({
        success :true  , 
        data : comment 
    })

})


const getAllCommentByBlog = asyncErrorWrapper(async(req, res, next) => {

    const { slug } = req.params

    const blog = await Blog.findOne({slug:slug})

    const commmentList =await Comment.find({
        blog : blog._id 
    }).populate({
        path :"author",
        select:"username photo"
    }).sort("-createdAt")

    return res.status(200)
        .json({
            success: true,
            count: blog.commentCount,
            data: commmentList
        })

})

const commentLike = asyncErrorWrapper(async(req, res, next) => {

    const { activeUser} =  req.body 
    const { comment_id} =  req.params 


    const comment = await Comment.findById(comment_id)

    if (!comment.likes.includes(activeUser._id)) {

        comment.likes.push(activeUser._id)
        comment.likeCount = comment.likes.length ;

        await comment.save()  ;

    }
    else {

        const index = comment.likes.indexOf(activeUser._id)
        comment.likes.splice(index, 1)
        comment.likeCount = comment.likes.length
        await comment.save()  ;
    }

    const likeStatus = comment.likes.includes(activeUser._id)
    
    return res.status(200)
        .json({
            success: true,
            data : comment,
            likeStatus:likeStatus
        })

})

const getCommentLikeStatus = asyncErrorWrapper(async(req, res, next) => {

    const { activeUser} =  req.body 
    const { comment_id} =  req.params 

    const comment = await Comment.findById(comment_id)
    const likeStatus = comment.likes.includes(activeUser._id)

    return res.status(200)
    .json({
        success: true,
        likeStatus:likeStatus
    })

})

module.exports ={
    addNewCommentToBlog,
    getAllCommentByBlog,
    commentLike,
    getCommentLikeStatus
}