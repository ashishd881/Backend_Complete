import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // both cookieParser and cors are configured when the app is made

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//these are econfigurations now
app.use(express.json({ limit: "16kb" })); //we are accepting json on this file
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url ko encode karne ke liye because in some places we would need ki space %20 kar diya extended se mtlb object ke andar object aa sakta hai
app.use(express.static("public")); //public assets banaya hai image sfevicin rakhne ke liye  public folder ka naam hai

//server ke user ke brower ki cookies ko set aur access karna ie using curd operations
app.use(cookieParser());

//routes import

import userRouter from "./routes/user.routes.js"; //manchaha naam diya because export default hua hai

//routes declaration

// app.use("/users",userRouter)           //middle ware se router ko la rahe hai  ie users pe type karte hi control de diya userRouters pe user router user.routes.js file pe le jayega aur waha se pata chalega ki route pe user ko le jana hai
// http://localhost:8000/users/register pe chala jayega
//users ke baad sare cheeze user.routes.js me likhi jayengi

//but here we are creating apis

app.use("/api/v1/users", userRouter); //http://localhost:8000/api/v1/users/registerv1 is version 1
//this will take us to 

export { app };
