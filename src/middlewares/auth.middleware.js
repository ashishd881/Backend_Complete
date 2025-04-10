//ye middleware verify karega ki user hai ki nahi hamaar khud ka middlwware hai ye
//logout karne ke liye ye functionality baniyi gayi hai
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js"
export const verifyJWT = asyncHandler(async(req,res, next)=>{          //response khali pada hai toh usko _ se replace kar do
   try {
     const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ","")                 //requsest ke pass cookies ka access hai cookie parse ke waajhe  se optional is used because it might be possibe that cookies dont have accesstoken also user may be sending custom header so we check this also
     if(!token){
         throw new ApiError(401,"Unauthorized error")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
     if(!user){
         throw new ApiError(401,"Invalid Access Token")
     }
 
     req.user = user;
     next()
   } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Acccess Token")
   }

})