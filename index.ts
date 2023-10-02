import {Server} from "socket.io"
import http from "http"
import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config"
import App from "./app"
import * as db from "./database"
import {auth,validatePassword} from "./middleware"
const app = App(db,auth,validatePassword)
const server = http.createServer(app)
const io = new Server(server)
io.on("connection",async socket=>{
    socket.on("getRoomCount",async ({roomId})=>{
        try{
            const liveSockets = await io.in(roomId).fetchSockets()
            var liveUsers:string[] = []
            for(let soc of liveSockets)liveUsers.push(soc.handshake.auth.email)
            var distinctLiveUsers = new Set<string>(liveUsers)
            const cnt = [...distinctLiveUsers].length
            io.emit("roomCount",{roomId,cnt})
        }
        catch{
            socket.disconnect()
        }

    })
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
        try{
        const userEmail = socket.handshake.auth.email
        socket.leave(roomId)
        const liveSockets = await io.in(roomId).fetchSockets()
        var liveUsers:string[] = []
        for(let soc of liveSockets)liveUsers.push(soc.handshake.auth.email)
        var distinctLiveUsers = Array.from(new Set<string>(liveUsers))
        const cnt = distinctLiveUsers.length
        io.to(roomId).emit("activity",{cnt,liveUsers:distinctLiveUsers})
        io.emit("roomCount",{roomId,cnt})}
        catch{
            socket.disconnect()
        }
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