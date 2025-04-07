import {v2 as cloudinary} from "cloudinary"  //v2 ko cloudnary naam de diya
import fs from "fs"      //fs is filesystem  from nodejs

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudnary =async(localFilePath)=>{
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary withthe help of uploader 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto" //file ke bare me khud detect kar lega
        })
        //file has been successfully uploaded
        console.log("file is uploaded in cloudinary",response.url);
        return response    //pura ka pura response bejh diya user ko jo chaiyea wo usko le lega
    }catch(error){
        fs.unlinkSync(localFilePath)     //removes the locally saved temporary file as the upload operation got failed
    }
}

export {uploadOnCloudnary}