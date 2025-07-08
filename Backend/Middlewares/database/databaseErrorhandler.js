const asyncErrorWrapper = require("express-async-handler")
const CustomError = require("../../Helpers/error/CustomError");
const Blog = require("../../Models/blog")


const checkBlogExist = asyncErrorWrapper(async (req,res,next) => {
  
    const {slug} = req.params  ;
    const blog = await Blog.findOne({
      slug : slug
    })

    if(!blog) {
        return next(new CustomError("There is no such blog with that slug ",400))
    }

    next() ; 

})


const checkUserAndBlogExist = asyncErrorWrapper(async(req, res, next) => {

    const {slug} =req.params 

    const blog = await Blog.findOne({
        slug : slug ,
        author :req.user 
    })

    if (!blog ) {
        return next(new CustomError("There is no blog with that slug associated with User ",400))
    }

    next() ; 

})

module.exports ={
    checkBlogExist,
    checkUserAndBlogExist
}
