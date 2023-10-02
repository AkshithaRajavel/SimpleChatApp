import { NextFunction,Request,Response } from "express"
export default function auth(req:Request,res:Response,next:NextFunction){
    try {
        if(!req.body.user)throw new Error()
        res.locals.email = req.body.user
        next();
    } catch (error) {
        res.status(401).json({message: "unauthorized" });
    }
}