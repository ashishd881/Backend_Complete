import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:"ok"
    })
})


export {registerUser}        //object ke form me export kar diya
//note yaha jis tarah export hua hai uai tarah import karna hoga