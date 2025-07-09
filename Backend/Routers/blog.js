const express = require("express");
const router = express.Router();

const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
// const { uploadBlogImage } = require("../Helpers/Libraries/imageUpload"); // your multer/cloudinary setup

const {
  addBlog,
  getAllBlogs,
  detailBlog,
  likeBlog,
  editBlogPage,
  editBlog,
  deleteBlog,
} = require("../Controllers/blog");
const { upload } = require('../Middlewares/multer.middleware');


const { checkBlogExist, checkUserAndBlogExist } = require("../Middlewares/database/databaseErrorhandler");

// Create blog - protected + image upload
router.post("/addblog", getAccessToRoute, upload.single("image"), addBlog);

// Get all blogs - public
router.get("/getAllBlogs", getAllBlogs);

// Detail blog by slug
router.post("/:slug", checkBlogExist, detailBlog);

// Like/unlike blog
router.post("/:slug/like", getAccessToRoute, checkBlogExist, likeBlog);

// Edit blog page data
router.get("/editBlog/:slug", getAccessToRoute, checkBlogExist, checkUserAndBlogExist, editBlogPage);

// Edit blog - protected + image upload
// ✅ Correct field name (matches frontend)
router.put("/:slug/edit", getAccessToRoute, checkBlogExist, checkUserAndBlogExist, upload.single("image"), editBlog);

// Delete blog - protected
router.delete("/:slug/delete", getAccessToRoute, checkBlogExist, checkUserAndBlogExist, deleteBlog);

module.exports = router;
