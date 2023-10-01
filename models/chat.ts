import mongoose from "mongoose";
const roomSchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        description:{type:String,required:true}
    }
)
interface roomType{
    name:string,
    description:string
}
const model = mongoose.model<roomType>("Room",roomSchema)
export default model<roomType>
