const asyncErrorWrapper = require("express-async-handler");
const User = require("../Models/user");
const Blog = require("../Models/blog");
const CustomError = require("../Helpers/error/CustomError");
const { comparePassword, validateUserInput } = require("../Helpers/input/inputHelpers");
// const cloudinary = require("cloudinary").v2;
const { uploadOnCloudinary, deleteFromCloudinary } = require('../Helpers/Libraries/cloudinary');

// Helper to delete photo from Cloudinary by public_id extracted from URL
// const deleteUserPhotoFromCloudinary = async (imageUrl) => {
//   if (!imageUrl) return;

//   try {
//     const parts = imageUrl.split("/");
//     const fileWithExt = parts[parts.length - 1];
//     const publicId = fileWithExt.split(".")[0];
//     const folder = "userPhotos";
//     const fullPublicId = `${folder}/${publicId}`;

//     await cloudinary.uploader.destroy(fullPublicId);
//     console.log("✅ User photo deleted from Cloudinary");
//   } catch (err) {
//     console.error("❌ Error deleting user photo:", err);
//   }
// };

const profile = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

const editProfile = asyncErrorWrapper(async (req, res, next) => {
  const { email, username } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  user.email = email;
  user.username = username;

  // ✅ Only if a new file was uploaded
  if (req.file) {
    const photoLocalPath = req.file.path;

    // Delete old image from Cloudinary (if exists)
    if (user.photo) {
      const publicId = user.photo.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    const photo = await uploadOnCloudinary(photoLocalPath);
    if (!photo || !photo.url) {
      return next(new CustomError("Error while uploading profile pic", 400));
    }

    user.photo = photo.url;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    updatedUser: user,
  });
});


const changePassword = asyncErrorWrapper(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;

  if (!validateUserInput(newPassword, oldPassword)) {
    return next(new CustomError("Please check your inputs ", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!comparePassword(oldPassword, user.password)) {
    return next(new CustomError("Old password is incorrect ", 400));
  }

  user.password = newPassword;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Change Password Successfully",
    user: user,
  });
});

const addBlogToReadList = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { activeUser } = req.body;

  const blog = await Blog.findOne({ slug });
  const user = await User.findById(activeUser._id);

  if (!user.readList.includes(blog.id)) {
    user.readList.push(blog.id);
  } else {
    const index = user.readList.indexOf(blog.id);
    user.readList.splice(index, 1);
  }
  user.readListLength = user.readList.length;
  await user.save();

  const status = user.readList.includes(blog.id);

  return res.status(200).json({
    success: true,
    blog: blog,
    user: user,
    status: status,
  });
});

const readListPage = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new CustomError('User not found', 404));
  }

  const readList = await Blog.find({
    _id: { $in: user.readList },
  }).populate("author", "username");

  return res.status(200).json({
    success: true,
    readList, // renamed to match frontend expectation
  });
});

module.exports = {
  profile,
  editProfile,
  changePassword,
  addBlogToReadList,
  readListPage,
};
