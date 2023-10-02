import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { userType } from "../types";
const userSchema = new mongoose.Schema({
    email :  {type:String,required:true},
    password : {type:String,required:true}}
)
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });
const model = mongoose.model<userType>("User",userSchema)
export default model<userType>