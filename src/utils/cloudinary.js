import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// we can use default cloudinary code here but we do it more oragnized Way

const uploadOnCloudinary = async (filePath) => {
  try {
    //  first check for filr path
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    //file has been upload successfully
    console.log("file has been uploaded", response.url);
    return response;
  } catch (error) {
    fs.unlink(filePath); //remove file save as temp upload operation
    return null;
  }
};

export { uploadOnCloudinary };
