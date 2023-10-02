import {describe, expect, test} from '@jest/globals';
import request from "supertest"
import App from "./app"
import * as db from "./test-database"
import auth from "./test-auth"
import {validatePassword} from "./middleware"
const app = App(db,auth,validatePassword)
describe("GET /api/isLoggedIn",()=>{
    test("if user is logged in",async ()=>{
        const response  = await request(app).get("/api/isLoggedIn").send({user:"user1"})
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe(true)
        expect(response.body.email).toBeDefined()
    })
    test("if user is not logged in",async()=>{
        const response  = await request(app).get("/api/isLoggedIn").send()
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBeDefined()
    })
})
describe("POST /api/login",()=>{
    test("username doesn't exist", async ()=>{
        const response = await request(app).post("/api/login").send(
            {email:"xxxxx",password:"xxxxxxxx"}
        )
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })
    test("wrong password", async ()=>{
        const response = await request(app).post("/api/login").send(
            {email:"user1",password:"xxxxxxxx"}
        )
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })
    test("correct credentials", async ()=>{
        const response = await request(app).post("/api/login").send(
            {email:"user1",password:"password1"}
        )
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()
        expect(response.body.email).toBeDefined()
    })
})
describe("POST /api/signup",()=>{
    test("username already exists", async ()=>{
        const response = await request(app).post("/api/signup").send(
            {email:"user1",password:"password1"}
        )
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })
    test("new username and invalid password", async ()=>{
        const response = await request(app).post("/api/signup").send(
            {email:"xxxx",password:"xxxxx"}
        )
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })
    test("new username and valid password", async ()=>{
        const response = await request(app).post("/api/signup").send(
            {email:"xxxx",password:"x1x2x3x4"}
        )
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBeDefined()
    })
})
describe("GET /api/getRooms",()=>{
    test("authenticated user",async ()=>{
        const response = await request(app).get("/api/getRooms").send({user:"user1"})
        expect(response.statusCode).toBe(200)
        expect(response.body.rooms.length).toBeGreaterThan(0)
        for(let room of response.body.rooms){
            expect(typeof room._id).toBe("string")
            expect(typeof room.name).toBe("string")
            expect(typeof room.description).toBe("string")
            expect(typeof room.cnt).toBe("number")
        }
    })
})
describe("GET /api/joinRoom",()=>{
    test("authenticated user",async ()=>{
        const response = await request(app).get("/api/joinRoom?roomId=1").send({user:"user1"})
        expect(response.statusCode).toBe(200)
        expect(typeof response.body.roomName).toBe("string")
        expect(typeof response.body.description).toBe("string")
    })
})