const express = require("express");
const router = express.Router();

const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
// const { uploadUserPhoto } = require("../Helpers/Libraries/imageUpload"); // from your updated multer-cloudinary helper
const { upload } = require('../Middlewares/multer.middleware');

const {
  profile,
  editProfile,
  changePassword,
  addBlogToReadList,
  readListPage,
} = require("../Controllers/user");

router.get("/profile", getAccessToRoute, profile);

// Use multer middleware to handle single photo upload from field 'photo'
router.patch(
  "/editProfile",
  getAccessToRoute,
  upload.single("photo"),
  editProfile
);

router.put("/changePassword", getAccessToRoute, changePassword);

router.post("/:slug/addBlogToReadList", getAccessToRoute, addBlogToReadList);

router.get("/readList", getAccessToRoute, readListPage);

module.exports = router;
