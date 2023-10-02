import { NextFunction,Request,Response } from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"
import * as types from "./types"
export const auth = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization as string
    try {
        const payload = jwt.verify(token.split(" ")[1], process.env.JWTSECRET as string) as types.authType;
        res.locals.email = payload.userEmail
        next();
    } catch (error) {
        res.status(401).json({message: "unauthorized" });
    }
}
export const validatePassword = (req:Request,res:Response,next:NextFunction)=>{
    const password = req.body.password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (passwordRegex.test(password))next()
    else res.status(400).json({message:"Minimum eight characters, at least one letter and one number"})
}