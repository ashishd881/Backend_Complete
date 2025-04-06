//package.json me main file index.js hai npm init se bahi thi
// require('dotenv').config({path: './.env'})            // https://www.npmjs.com/package/dotenv  //config ke andar env file ka path likh diya
//upar require likhne se we followed a bad practise we can convert it to import

import dotenv from "dotenv"     //niche config bhi kar do this is a experimental practice so we do so changesin package.json scripts   -r dotenv/config -- experimental-json-modules

// import mongoose from "mongoose"
// import { DB_NAME } from "./constants.js"
import connectDB from "./db/index.js"

dotenv.config({
    path: './.env'
})

connectDB()














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