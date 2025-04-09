//package.json me main file index.js hai npm init se bani thi
// require('dotenv').config({path: './.env'})            // https://www.npmjs.com/package/dotenv  //config ke andar env file ka path likh diya
//upar require likhne se we followed a bad practise we can convert it to import

import dotenv from "dotenv"; //niche config bhi kar do this is a experimental practice so we do so changes in package.json scripts   -r dotenv/config -- experimental-json-modules

// import mongoose from "mongoose"
// import { DB_NAME } from "./constants.js"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

connectDB() //connectDB ek asynchronous task hai toh wo ek promise bhi return karega toh response ke liye .then() laga liya error ke liye .catch() laga liya
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`SERVER IS running as port: ${process.env.PORT}`);
    });
  }) //server start karne ke liye .then me likha gaya hai app hamri database ka use kar ke listen karegi port ke liye process.env.PORT use kiya agar port nahi di gayi hai toh hum default port 80000 ka  use karenge
  .catch((err) => {
    console.log("MONGO db connection failed!!!", err);
  });

// function connectDB(){

// }
// we can make function like this also but we will make IIFE function
// we use async await because database is alwayaa is another continent and try cathch is used because we can always get an error
/*
import express from "express"
const app = express()
(async () =>{
    try {
        await mongoose.connect(`$process.env.MONGODB_URI/${DB_NAME}`)
        app.on("error",(error) =>{
            console.log("ERROR",error);
            throw error
        })           //these are listneres of express
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR:",error)
    }
})()
*/

// the above database connection can be done in index.js file of db folder also
