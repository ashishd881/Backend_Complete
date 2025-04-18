import mongoose from "mongoose";


const playlistSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    videos:[//onject ke arraya hai
        {
            type:Schema.Types.ObjectId,
            ref:"Video",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Playlist =  mongoose.model("Playlist",playlistSchema)
