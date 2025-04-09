import { v2 as cloudinary } from "cloudinary"; //v2 ko cloudnary naam de diya
import fs from "fs"; //fs is filesystem  from nodejs
import dotenv from "dotenv"
import { response } from "express";

dotenv.config()
cloudinary.config({
  // cloud_name: "diur6iwwz",
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: "319868831957914",
  api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: "1wuJCZMQebn7AynOiq-Shidng5Y",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    console.log(localFilePath);
    
    //upload the file on cloudinary withthe help of uploader
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",           //file ke bare me khud detect kar lega
      
    });

    console.log(response)
    //file has been successfully uploaded
    console.log("file is uploaded in cloudinary", response.url);
    fs.unlinkSync(localFilePath)            //This line synchronously deletes the file located at localFilePath
    return response; //pura ka pura response bejh diya user ko jo chaiyea wo usko le lega
  } catch (error) {
    console.log(error);
    
    fs.unlinkSync(localFilePath); //removes the locally saved temporary file as the upload operation got failed
  }
};

export { uploadOnCloudnary };
