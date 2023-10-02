import mongoose,{ HydratedDocument} from "mongoose"
import User from "./models/user"
import Room from "./models/chat"
import bcrypt from "bcrypt"
import { userType, roomType } from "./types"
mongoose.connect(process.env.MONGOCONNECTION as string).then(()=>{})
export async function createUser(user:userType){
    await (new User(user)).save()
}
export async function userExists(email:string){
    if(await User.findOne({ email: email }))return true
    return false
}
export async function validateUser(email:string,password:string){
    const user = await User.findOne({ email: email }) as HydratedDocument<userType>
    if(!await bcrypt.compare(password, user.password))return false
    return true
}
export async function getRooms(){
    return await Room.find({})
}
export async function getRoom(roomId:string){
    return await Room.findOne({_id:roomId}) as HydratedDocument<roomType>
}