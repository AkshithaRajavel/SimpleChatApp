import fs from "fs"
import { test_db,userType } from "./types"
var database:test_db
fs.readFile("./test-db.json","utf-8",(err,data)=>{
    database = JSON.parse(data)
})
export async function createUser(user:userType){}
export async function userExists(email:string){
    if(database.users.map(user=>user.email).includes(email))return true
    return false
}
export async function validateUser(email:string,password:string){
    const user = database.users.filter(user=>user.email==email)[0]
    if(password != user.password)return false
    return true
}
export async function getRooms(){
    return database.rooms
}
export async function getRoom(roomId:string){
    return database.rooms.filter(room=>room._id ==roomId)[0]
}