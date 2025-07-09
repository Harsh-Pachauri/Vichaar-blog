const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotenv = require("dotenv")



// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Upload function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // Delete local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;

  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Delete local file on error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

// Delete function
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

module.exports = {
  uploadOnCloudinary,
  deleteFromCloudinary
};
