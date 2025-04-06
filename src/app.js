import express from express
import cors from "cors"
import cookieParser from "cookie-parser" // both cookieParser and cors are configured when the app is made

const app =express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//these ar econfigurations now
app.use(express.json({limit:"16kb"}))     //we are accepting json on this file
app.use(express.urlencoded({extended: true,limit: "16kb"}))    //url ko encode karne ke liye because in some places we would need ki space %20 kar diya extended se mtlb object ke andar object aa sakta hai
app.use(express.static("public"))             //public assets banaya hai image sfevicin rakhne ke liye  public folder ka naam hai

//server ke user ke brower ki cookies ko set aur access karna ie using curd operations
app.use(cookieParser())


export {app}