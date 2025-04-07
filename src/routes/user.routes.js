import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";     //is tarak ka naam {registerUser} hum tabhi le sakte hai ja export default na ho


const router = Router()

router.route("/register").post(registerUser)     //http://localhost:8000/users/register pe chala jayega

// router.route("/login").post(login)     //http://localhost:8000/users/login pe chala jayega



export default router