import mongoose, { Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        //we use mongoose-aggegrate-paginate-v2 for this  from https://www.npmjs.com/package/mongoose-paginate-v2 this is injected as a plugin used in video.model
        type: Schema.Types.ObjectId,
        ref: "Video", //video ka reference le lenge
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"], //custom array message de diya agar userr ne password nahi diya ho toh
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);



// we cant use arrow function here because usme this ka use nahi kar skate hai async laga diya kyunki is kaam me time lag saakt hai
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10);
  // console.log(this.password)
  
  next(); /// 10 tells hash rounds
}); //pre is a middleware data save hone se password ko encrypt kar do read docs



//next dala gaya because agle kaam ko calll bhi karna hia
//this has a problem when we will save photo then also password will be encrypted so if condition is used

userSchema.method.isPasswordCorrect = async function (password) {
  //custom methods banaliya isPasswordCorrect
  return await bcrypt.compare(password, this.password); //true aur false dega user ka diya password password me hai aur this.passsword encrypted wala hai
};

userSchema.methods.generateAccessToken = function () {
  //these are jwt tokens
  return jwt.sign(
    {
      //sign method token generare kar diya
      // jo information hum ne di hai wo payload hai
      //this waali cheez data base se aa rahi hai
      //json.io
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      //expiry object ke andar jata hai
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//refresh token is generated the same waay but have less information
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      //sign method token generare kar diya
      // jo informatiopn hum ne di hai wo payload hai
      //this waali cheez data base se aa rahi hai
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      //expiry object ke andar jata hai
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
