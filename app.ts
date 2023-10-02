import express,{Request,Response} from 'express'
import bodyParser from "body-parser"
import cors from "cors"
import jwt from "jsonwebtoken"
import "dotenv/config"
export default function App(db:any,auth:any,validatePassword:any){
    const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(process.env.ROOTDIR+"/frontend/build"))
app.get("/api/isLoggedIn",auth,(req,res)=>res.json({status:true,email:res.locals.email}))
app.post("/api/signup",validatePassword,async(req:Request,res:Response)=>{
    try{
        const email = req.body.email as string 
        //checking if User already exists
        if (await db.userExists(email)) {
            return res.status(400).json({message: `User with email ${email} already exists` })
        }
        await db.createUser(req.body)
        res.json({message: "success" })}
        catch(error){
            //invalid req.body 
            res.status(500).send(error)
        }
})
app.post("/api/login",async(req:Request,res:Response)=>{
    try{
        const {email,password} = req.body
        if(!await db.userExists(email))return res.status(400).json({message:"user doesn't exist"})
        else if(!await db.validateUser(email,password))return res.status(400).json({message:"wrong password"})
        const payload = { userEmail:email }
        //generating auth token
        const token = jwt.sign(payload, process.env.JWTSECRET as string)
        res.json({message:"success",token:token,email:email})
    }
    catch{
        res.status(500).send("internal server error")
    }
})
app.get("/api/getRooms",auth,async (req:Request,res:Response)=>{
    try{
    const rooms = await db.getRooms()
    const response = []
    for(let room of rooms){
        response.push({
            _id:room._id,name:room.name,description:room.description,cnt: 0})
        }
    res.json({rooms:response})}
    catch{
        res.status(500).send("internal server error")
    }
}
)
app.get("/api/joinRoom",async (req:Request,res:Response)=>{
    try{
    const roomId = req.query.roomId as string
    const room = await db.getRoom(roomId)
    res.json({roomName:room.name,description:room.description})}
    catch{
        res.status(500).send("internal server error")
    }
})
app.get("*" ,(req,res)=>{
    try{
    res.sendFile(process.env.ROOTDIR+"/frontend/build/index.html")}
    catch{
        res.status(500).send("internal server error")
    }
})
return app
}