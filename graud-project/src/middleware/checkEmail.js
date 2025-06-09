import { userModel } from "../../db/models/user.model.js"
import { appError } from "../utils/appError.js"
import { catchError } from "./catchError.js"



export const checkEmail = catchError(async(req,res,next)=>{
    let checkEmail = await userModel.findOne({email:req.body.email})
    if(checkEmail) return next(new appError('Email already Exist',409))
    next()
})