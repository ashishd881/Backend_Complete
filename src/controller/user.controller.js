import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  console.log("email:", email);

  // if(fullname==="")
  // {
  //     throw new ApiError(400,"fullname is required")
  // }
  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    }) //some true aur false return karega condition laga ke check kar lo
    //some har field pe trim chalega aur agar ek bhi field ne true return kiya toh mtlb wo empty hai
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }], //phali cheez jo email aur username ko match karti hai wo mil jayegi
  });
  if (existedUser) {
    throw new ApiError(409, "user with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; //multer ne diya hai ye
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImage = await uploadOnCloudnary(coverImagePath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //jo jo nahi chaiye - kar ke likh diya
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while regestering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export { registerUser }; //object ke form me export kar diya
//note yaha jis tarah export hua hai uai tarah import karna hoga
