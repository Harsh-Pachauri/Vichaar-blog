const asyncErrorWrapper = require("express-async-handler");
const Blog = require("../Models/blog");
const { searchHelper, paginateHelper } = require("../Helpers/query/queryHelpers");
const { uploadOnCloudinary, deleteFromCloudinary } = require('../Helpers/Libraries/cloudinary');


const addBlog = asyncErrorWrapper(async (req, res, next) => {
  const { title, content } = req.body;

  const wordCount = content.trim().split(/\s+/).length;
  const readtime = Math.ceil(wordCount / 200);

  let imageUrl = "";

  // ✅ Upload to Cloudinary if a file was uploaded
  if (req.file) {
    const localPath = req.file.path;

    const uploadResult = await uploadOnCloudinary(localPath);
    if (!uploadResult || !uploadResult.url) {
      return next(new CustomError("Image upload failed", 400));
    }

    imageUrl = uploadResult.url;
  }

  // ✅ Save blog to DB
  const newBlog = await Blog.create({
    title,
    content,
    author: req.user._id,
    image: imageUrl,
    readtime,
  });

  return res.status(200).json({
    success: true,
    message: "Blog added successfully",
    data: newBlog,
  });
});


const getAllBlogs = asyncErrorWrapper(async (req, res, next) => {
  let query = Blog.find();
  query = searchHelper("title", query, req);

  const paginationResult = await paginateHelper(Blog, query, req);
  query = paginationResult.query.sort("-likeCount -commentCount -createdAt");

  const blogs = await query;

  return res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs,
    page: paginationResult.page,
    pages: paginationResult.pages,
  });
});

const detailBlog = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { activeUser } = req.body;

  const blog = await Blog.findOne({ slug }).populate("author likes");
  const likeStatus = blog.likes.some((user) => user.id === activeUser._id);

  return res.status(200).json({
    success: true,
    data: blog,
    likeStatus,
  });
});

const likeBlog = asyncErrorWrapper(async (req, res, next) => {
  const { activeUser } = req.body;
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug }).populate("author likes");
  const userIds = blog.likes.map((u) => u._id.toString());

  if (!userIds.includes(activeUser._id)) {
    blog.likes.push(activeUser);
  } else {
    const index = userIds.indexOf(activeUser._id);
    blog.likes.splice(index, 1);
  }

  blog.likeCount = blog.likes.length;
  await blog.save();

  return res.status(200).json({
    success: true,
    data: blog,
  });
});

const editBlogPage = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug }).populate("author likes");

  return res.status(200).json({
    success: true,
    data: blog,
  });
});

const editBlog = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { title, content, image: prevImageUrl } = req.body;

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  blog.title = title;
  blog.content = content;

  // ✅ If new image uploaded
  if (req.file?.path) {
    const localFilePath = req.file.path;

    // ✅ Delete old image from Cloudinary if exists
    if (prevImageUrl) {
      const publicId = prevImageUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    const uploadResult = await uploadOnCloudinary(localFilePath);
    if (!uploadResult || !uploadResult.url) {
      return next(new CustomError("Image upload failed", 400));
    }

    blog.image = uploadResult.url;
  }

  await blog.save();

  return res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: blog,
  });
});


const deleteBlog = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  // ✅ If blog has an image, delete from Cloudinary
  if (blog.image) {
    const publicId = blog.image.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await blog.remove();

  return res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});


module.exports = {
  addBlog,
  getAllBlogs,
  detailBlog,
  likeBlog,
  editBlogPage,
  editBlog,
  deleteBlog,
};
