const asyncErrorWrapper = require("express-async-handler")
const Blog = require("../Models/blog");
const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
const {searchHelper, paginateHelper} =require("../Helpers/query/queryHelpers")

const addBlog = asyncErrorWrapper(async  (req,res,next)=> {

    const {title,content} = req.body 

    var wordCount = content.trim().split(/\s+/).length ; 
   
    let readtime = Math.floor(wordCount /200)   ;


    try {
        const newBlog = await Blog.create({
            title,
            content,
            author :req.user._id ,
            image : req.savedBlogImage,
            readtime
        })

        return res.status(200).json({
            success :true ,
            message : "add blog successfully ",
            data: newBlog
        })
    }

    catch(error) {

        deleteImageFile(req)

        return next(error)
        
    }
  
})

const getAllBlogs = asyncErrorWrapper( async (req,res,next) =>{

    let query = Blog.find();

    query =searchHelper("title",query,req)

    const paginationResult =await paginateHelper(Blog , query ,req)

    query = paginationResult.query  ;

    query = query.sort("-likeCount -commentCount -createdAt")

    const blogs = await query
    
    return res.status(200).json(
        {
            success:true,
            count : blogs.length,
            data : blogs ,
            page : paginationResult.page ,
            pages : paginationResult.pages
        })

})

const detailBlog =asyncErrorWrapper(async(req,res,next)=>{

    const {slug}=req.params ;
    const {activeUser} =req.body 

    const blog = await Blog.findOne({
        slug: slug 
    }).populate("author likes")

    const blogLikeUserIds = blog.likes.map(json => json.id)
    const likeStatus = blogLikeUserIds.includes(activeUser._id)


    return res.status(200).
        json({
            success:true,
            data : blog,
            likeStatus:likeStatus
        })

})

const likeBlog =asyncErrorWrapper(async(req,res,next)=>{

    const {activeUser} =req.body 
    const {slug} = req.params ;

    const blog = await Blog.findOne({
        slug: slug 
    }).populate("author likes")
   
    const blogLikeUserIds = blog.likes.map(json => json._id.toString())
   
    if (! blogLikeUserIds.includes(activeUser._id)){

        blog.likes.push(activeUser)
        blog.likeCount = blog.likes.length
        await blog.save() ; 
    }
    else {

        const index = blogLikeUserIds.indexOf(activeUser._id)
        blog.likes.splice(index,1)
        blog.likeCount = blog.likes.length

        await blog.save() ; 
    }
 
    return res.status(200).
    json({
        success:true,
        data : blog
    })

})

const editBlogPage  =asyncErrorWrapper(async(req,res,next)=>{
    const {slug } = req.params ; 
   
    const blog = await Blog.findOne({
        slug: slug 
    }).populate("author likes")

    return res.status(200).
        json({
            success:true,
            data : blog
    })

})


const editBlog  =asyncErrorWrapper(async(req,res,next)=>{
    const {slug } = req.params ; 
    const {title ,content ,image ,previousImage } = req.body;

    const blog = await Blog.findOne({slug : slug })

    blog.title = title ;
    blog.content = content ;
    blog.image =   req.savedBlogImage ;

    if( !req.savedBlogImage) {
        // if the image is not sent
        blog.image = image
    }
    else {
        // if the image sent
        // old image locatıon delete
       deleteImageFile(req,previousImage)

    }

    await blog.save()  ;

    return res.status(200).
        json({
            success:true,
            data :blog
    })

})

const deleteBlog  =asyncErrorWrapper(async(req,res,next)=>{

    const {slug} = req.params  ;

    const blog = await Blog.findOne({slug : slug })

    deleteImageFile(req,blog.image) ; 

    await blog.remove()

    return res.status(200).
        json({
            success:true,
            message : "Blog delete succesfully "
    })

})


module.exports ={
    addBlog,
    getAllBlogs,
    detailBlog,
    likeBlog,
    editBlogPage,
    editBlog ,
    deleteBlog
}