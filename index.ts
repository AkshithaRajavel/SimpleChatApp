import {Server} from "socket.io"
import http from "http"
import express,{Request,Response} from 'express'
import bodyParser from "body-parser"
import cors from "cors"
import mongoose,{ HydratedDocument, set } from "mongoose"
import User from "./models/user"
import Room from "./models/chat"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config"
import auth from "./middleware"
import * as types from "./types"
mongoose.connect(process.env.MONGOCONNECTION as string).then(()=>console.log("mongo connection established"))
const app = express()
const server = http.createServer(app)
const io = new Server(server)
// const io = new Server(server,{
//     cors: {
//         origin: "http://localhost:3000"
//       }
// })
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(process.env.ROOTDIR+"/frontend/build"))
app.get("/api/isLoggedIn",auth,(req,res)=>res.json({status:true,email:res.locals.email}))
app.post("/api/signup",async(req:Request,res:Response)=>{
    try{
        const email = req.body.email
        //checking if User already exists
        if (await User.findOne({ email: email })) {
            return res.status(400).json({message: `User with email ${email} already exists` })
        }
        var patient = new User(req.body)
        await patient.save()
        res.json({message: "success" })}
        catch(error){
            //invalid req.body 
            res.status(500).send(error)
        }
})
app.post("/api/login",async(req:Request,res:Response)=>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email:email}) as HydratedDocument<types.userType>
        if(!user)return res.status(400).send("user doesn't exist")
        else if(!await bcrypt.compare(password, user.password as string))return res.status(400).send("wrong password")
        const payload = { userEmail:user.email }
        //generating auth token
        const token = jwt.sign(payload, process.env.JWTSECRET as string)
        res.json({message:"success",token:token,email:user.email})
    }
    catch{
        res.status(500).send("internal server error")
    }
})
app.get("/api/getRooms",auth,async (req:Request,res:Response)=>{
    const rooms = await Room.find({})
    const response = []
    for(let room of rooms){
        response.push({
            _id:room._id,name:room.name,description:room.description,
            cnt: (await io.in(room._id.toString()).fetchSockets()).length})
    }
    res.json({rooms:response})
})
app.get("/api/joinRoom",async (req:Request,res:Response)=>{
    const roomId = req.query.roomId as string
    const room = await Room.findOne({_id:roomId}) as HydratedDocument<types.roomType>
    res.json({roomName:room.name,description:room.description})
})
app.get("*" ,(req,res)=>{
    res.sendFile(process.env.ROOTDIR+"/frontend/build/index.html")
})
io.on("connection",async socket=>{
    socket.on("join",async ({roomId})=>{
        try{
        const token = socket.handshake.auth.token
        const payload  = jwt.verify(token, process.env.JWTSECRET as string) as JwtPayload
        const userEmail = payload.userEmail
        socket.handshake.auth.email = userEmail
        socket.join(roomId)
        const liveSockets = await io.in(roomId).fetchSockets()
        var liveUsers:string[] = []
        for(let soc of liveSockets)liveUsers.push(soc.handshake.auth.email)
        var distinctLiveUsers = new Set<string>(liveUsers)
        const cnt = [...distinctLiveUsers].length
        io.to(roomId).emit("activity",{cnt,liveUsers:[...distinctLiveUsers]})
        io.emit("roomCount",{roomId,cnt})}
        catch{
            socket.disconnect()
        }
    })
    socket.on("leave",async ({roomId})=>{
        const userEmail = socket.handshake.auth.email
        socket.leave(roomId)
        const liveSockets = await io.in(roomId).fetchSockets()
        var liveUsers:string[] = []
        for(let soc of liveSockets)liveUsers.push(soc.handshake.auth.email)
        var distinctLiveUsers = Array.from(new Set<string>(liveUsers))
        const cnt = distinctLiveUsers.length
        io.to(roomId).emit("activity",{cnt,liveUsers:distinctLiveUsers})
        io.emit("roomCount",{roomId,cnt})
    })
    socket.on("message",async ({message,roomId})=>{
        try{
            const token = socket.handshake.auth.token
            const payload  = jwt.verify(token, process.env.JWTSECRET as string) as JwtPayload
            const userEmail = payload.userEmail
            io.to(roomId).emit("message",{userEmail,message})
        }
        catch{
            socket.disconnect()
        }
    })
})
server.listen(4000,()=>console.log('server running !!!'))