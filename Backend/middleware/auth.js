const ErrorHandler = require("../utils/errorHandler");
const asyncError = require("./asyncError");
const jwt=require("jsonwebtoken")
const User=require("../Models/userModel");
exports.isAuthenticatedUser=asyncError(async(req,res,next)=>{
    const {token}=req.cookies
   if(!token){
    return next(new ErrorHandler("please login to access resources",401))
   }
const decodedData=jwt.verify(token,process.env.JWT_SECRET)
req.user=await User.findById(decodedData.id)
next()
})
exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next (new ErrorHandler(`Role:${req.user.role}is not allowed to access this`,403))

        }
        next()
    }
    
}
