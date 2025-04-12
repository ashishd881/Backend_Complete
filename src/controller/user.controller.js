import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"  
// import mongoose from "mongoose";

const generateAccessAndRefreshTokens  = async(userId)=>{  //this is not a  webrequest and a internal method so no need of asyncHandler 
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken= refreshToken
    await user.save({validateBeforeSave : false})                        //save karenge toh password mangane toh validateBeforeSave use kiya database me save kiya
    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError (500,"something went wrong while geneating refresh and access tokens")
  }
}
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message:"ok"
  // })
  //get user details from frontend
  //validation lagao name empty toh nahi hai email me @ hai ki nahi
  //check if user already exists by username and email
  //check for images and avtar and  upload them to cloudnary
  //create user object - creation call for creating entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  //taking user details from frontend
  const { fullname, email, username, password } = req.body;


  // if(fullname==="")
  // {
  //     throw new ApiError(400,"fullname is required")
  // }
  if (
    [fullname, email, username, password].some((field) => 
      field?.trim() === ""
    ) //some true aur false return karega condition laga ke check kar lo
    //some har field pe trim chalega aur agar ek bhi field ne true return kiya toh mtlb wo empty hai
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //phali cheez jo email aur username ko match karti hai wo mil jayegi
  });
  if (existedUser) {
    throw new ApiError(409, "user with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; //multer ne diya hai ye
  // const coverImagePath = req.files?.coverImage[0]?.path;  //Agar isko nahi bejha toh error aayega console.log(response) this is because coverimage nahi aayi toh path nahi aayega beccause array bana hi nahi so we use another method
  
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
  {
    coverImageLocalPath = req.files.coverImage[0].path
  }
  //ab coverimage nahi denge toh error nahi aayegi aur empty path print ho jayega
  // console.log("yaha se print hua ")
  // console.log(req.files);

  
 
  
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }


  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImage = await uploadOnCloudnary(coverImageLocalPath);



  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

 
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // console.log(user);
  
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //jo jo nahi chaiye - kar ke likh diya
  );
  // console.log(createdUser);
  
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while regestering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser  = asyncHandler(async (req,res)=>{
      //req body ->data
      //username or email
      //find the user
      //password check
      //access and refresh token
      //send the tokens with the help of cookies

      const {email,username,password} = req.body
      if( !(username || email)){
         throw new ApiError(400,"email or password is required")
      }

      const user = await User.findOne({
        $or:[{username},{email}]                      //$se mongodb ke operators use hue hai ye username ya toh email ke basis pe search karega jo mil gaya wo retutn karega
      }) //user import hua hai

      if(!user){
        await ApiError(404,"User doesnt exist")
      }

      const isPasswordValid = await user.isPasswordCorrect(password)
      if(!isPasswordValid){
        await ApiError(401,"Invalid User credentials")
      }

      const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)          //accesstoken aur refreshtoken return hoga toh destructure kar ke le lo variable me

      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

      const options = {          //options object is designed to use cookies
        httpOnly : true,
        secure : true
      }

      return res
                .status(200)
                .cookie("accessToken", accessToken,options)
                .cookie("refreshToken",refreshToken,options)
                .json(      //json response bejh diya
                  new ApiResponse(
                    200,
                    {
                      user:loggedInUser,accessToken,refreshToken
                      
                    },
                    "User loggedIn Successfully"
                  )
                )
                
})

const logoutUser = asyncHandler(async(req,res) => {
  //user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new:true
    }
  )
  const options = {          //options object is designed to use cookies
    httpOnly : true,
    secure : true
  }
  return  res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200,{},"User logged Out"))

})

const refreshAccessToken = asyncHandler(async (req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken                      //koi agar mobile app use kar raha hai toh body se refresh token aayega

  if(!incomingRefreshToken){
    throw new ApiError(401,"inauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
  
    )
  
    const user = await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401,"Invalid refresh token")
    }
  
    if(incomingrefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh Token is expired ao used")
    }
  
    const options = {
      httpOnly :true,
      secure: true
    }
  
    const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res
              .status(200)
              .cookie("accessToken",accessToken, options)
              .cookie("refreshToken",newrefreshToken,options)
              .json(
                new ApiResponse(
                  200,
                  {accessToken , refreshToken : newrefreshToken},
                  "Access Token Refreshed"
                )
              )
  
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword} = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave : false})

  return res
            .status(200)
            .json(new ApiResponse(200,{},"Password Change successfully"))

})

const getCurrentUser = asyncHandler(async(req,res) =>{
  return res
            .status(200)
            .json(new ApiResponse(200,req.user, " current user fetched successgully"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullname, email}  = req.body

  if(!fullname || !email){
    throw new ApiError(400,"All fields are required")
  }

  const user = User.findByIdAndUpdate(req.user?._id,{
      $set: {
        fullname,
        email:email,
      }
  },{new : true}
  ).select("-password")

  return res
            .status(200)
            .json(new ApiResponse(200,user,"Account Details uploaderr successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res) =>{
  const avatarLocalPath =  req.file?.path   //multer middlewaare se mila hai ye agar file present hai toh optionally wo file le li
  //agar cloudinary use nahi karna toh isko bhi hum database me upload kara sakte hai

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatat file is missing")
  }

  const avatar = await uploadOnCloudnary(avatarLocalPath)

  if(!avatar.url){
    throw new ApiError(400,"Error while uploading on avatar")
  }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : {
        avatar : avatar.url
      }
    },
    {new : true}
  ).select("-password")

  //delete the  previous avatar file by making a utility function purani image ko delete kar do purane url se

  return res
            .status(200)
            .json(
              new ApiResponse(200, user,"Avatar image updated successfully")
            )

})


const updateUserCoverImage = asyncHandler(async(req,res) =>{
  const coverImageLocalPath =  req.file?.path   //multer middlewaare se mila hai ye agar file present hai toh optionally wo file le li
  //agar cloudinary use nahi karna toh isko bhi hum database me upload kara sakte hai

  if(!coverImageLocalPath){
    throw new ApiError(400,"coverImage file is missing")
  }

  const coverImage = await uploadOnCloudnary(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400,"Error while uploading on avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : {
        coverImage : coverImage.url
      }
    },
    {new : true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, user,"Cover image updated successfully")
  )

})

const getUserChannelProfile = asyncHandler(async(req)=>{
  const {username}=req.params             //body se request nahi karenge params se karenge ie url se username nilkal liya
  if(!username?.trim){          //optional operator ka use kiy abecause it is possible thar username we get may not exist
    throw new ApiError(400,"usename is missing")
  }
  // User.find({username})
  //aggregate mthod array leta hai uske andar pipelines likhi jati hai [{},{},{}]  curlybraces ke andar pipeline hai  aggegrate pipeline likhne ke baad jo values aati hai wo array ke form me aati hai
  const channel = await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase()
      }
    },
    {
      $lookup:{
        from:"subscriptions",            //Subscription lowercase aur plural ho jayega
        localField: "_id",
        foreignField: "channel",
        as:"subscribers"
      }
    },
    {
      $lookup:{
        from:"subscriptions",            //Subscription lowercase aur plural ho jayega
        localField: "_id",
        foreignField: "subscriber",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        subscribersCount:{
          $size:"$subscribers"           //ye subscribers ka count aa gaya $ is used because this is a field
        },
        channelsSubscribedToCount:{
          $size:"$subscribedTo"
        },
        isSubscribed:{
          $cond:{
            if:{$in:[req.user?._id,"$subscribers.subscriber"]},    //user ke id nikal ki aur field ke andar ja ke compare kar liya 
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project:{    //jis jis values ko project kana hai unke aaage 1 laga do
        fullname:1,
        Username:1,
        subscribersCount:1,
        channelsSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1
      }
    }
  ])
  if(!channel?.length){
    throw new ApiError(404,"chanenl doesnt exist")
  }
  return res
            .status(200)
            .json(
              new ApiResponse(200,"userchannel fetched successfully")
            )
})

const getWatchHistory = asyncHandler(async(req,res)=>{
  const user = await User.aggregate([
    {   //req.user._id string deta hai aur us string ko mongodb id me convert kar deta hia 
      $match:{
        _id : new mongoose.Types.ObjectId(req.user._id)          //req.user._id jab hum pipelinening me likhte hai tab mongoose usko objectid me convert nahi kar pata hai so we will create object id 
      }
    },
    {
      $lookup :{
        from :"vidoes",
        localField: "watchHistory",
        foreignField:"_id",
        as:"watchHistory",               //comma laga hum sub pipeline likhenge
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first: "$owner"
              }
            }
          }
        ]
      }
    }
  ])   
  return res
          .status(200)
          .json(
            new ApiResponse(200,user[0].getWatchHistory,"watch History Fetched Successfully")
          )                     
})

export { registerUser,
          loginUser,
          logoutUser,
          refreshAccessToken,
          changeCurrentPassword,
          getCurrentUser,
          updateAccountDetails,
          updateUserAvatar,
          updateUserCoverImage,
          getUserChannelProfile,
          getWatchHistory



}; //object ke form me export kar diya
//note yaha jis tarah export hua hai uai tarah import karna hoga
