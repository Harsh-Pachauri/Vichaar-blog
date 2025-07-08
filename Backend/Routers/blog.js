const express = require("express")
const imageupload = require("../Helpers/Libraries/imageUpload");

const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
const {addBlog,getAllBlogs,detailBlog,likeBlog, editBlog, deleteBlog, editBlogPage } = require("../Controllers/blog")
const { checkBlogExist, checkUserAndBlogExist } = require("../Middlewares/database/databaseErrorhandler");

const router = express.Router() ;

router.post("/addblog" ,[getAccessToRoute, imageupload.single("image")],addBlog)


router.post("/:slug", checkBlogExist, detailBlog)

router.post("/:slug/like",[getAccessToRoute,checkBlogExist] ,likeBlog)

router.get("/editBlog/:slug",[getAccessToRoute,checkBlogExist,checkUserAndBlogExist] , editBlogPage)

router.put("/:slug/edit",[getAccessToRoute,checkBlogExist,checkUserAndBlogExist, imageupload.single("image")] ,editBlog)

router.delete("/:slug/delete",[getAccessToRoute,checkBlogExist,checkUserAndBlogExist] ,deleteBlog)

router.get("/getAllBlogs",getAllBlogs)


module.exports = router