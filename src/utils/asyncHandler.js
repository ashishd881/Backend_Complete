const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// the above can be done like this also
//asyncHandler is a higher order function ie wo function jo function ko accept aur return kar saakte hai
// const asyncHandler = (fn)=>{}
// const asyncHandler = (fn)=> {()=>{}}    we just remove the curly braces

// const asyncHandler = (fn)=> async(req,res,next)=>{                 //jo function pass kiya hai us se hum ne err,req,res,next me se req,res,next le li
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             messsage: err.messsage
//         })
//     }
// }
