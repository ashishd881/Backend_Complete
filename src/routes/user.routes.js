import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controller/user.controller.js"; //is tarak ka naam {registerUser} hum tabhi le sakte hai ja export default na ho
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1, //because 1 file accept karenge
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
); //http://localhost:8000/users/register pe chala jayega upload kar ke middleware lagaya hai multiple filws ko process kane ke liye field ka use huaa hai

// router.route("/login").post(login)     //http://localhost:8000/users/login pe chala jayega

router.route("/login").post(loginUser)


//secured routes

router.route("/logout").post(verifyJWT ,logoutUser)       //logoutUser run hone se phale verify jWT chalega
router.route("/refresh_token").post(refreshAccessToken)   //verifyjwt not required 
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)       //saari cheexe update nahi kiya so we use .patch
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)         //params se le rahe hai data 
router.route("/history").get(verifyJWT, getWatchHistory)


export default router;
