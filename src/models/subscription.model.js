import mongoose from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,       //one who is subscribing
        ref :"User"
    },
    channel:{
        type : Scheama.Types.ObjectId, //ont to whom 'subscriber is' subscribing
        ref : "User"
    }
},{timestamps: true})



export const Subscription = mongoose.model("Subscription",subscriptionSchema)