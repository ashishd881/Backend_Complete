//midderware hum multer se bnayenge so import multer
import multer from "multer"


//we are using disk storage
//this has been copied from multer
const storage = multer.diskStorage({
    //request ke andar body ka json data hai aur file ke andar file aayegi multer ke help se cb is callback 
    destination: function (req, file, cb) {
      cb(null, './public/temp')     //first parameter is null because we dont worry about errors and file destination is given
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)    
    }
  })
  //file ka pura local path return kar dega ye
  
export const upload = multer({ storage: storage })


//above line can be return as {storage } only because both names are same