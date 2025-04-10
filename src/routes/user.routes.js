import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controller/user.controller.js"; //is tarak ka naam {registerUser} hum tabhi le sakte hai ja export default na ho
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
export default router;
