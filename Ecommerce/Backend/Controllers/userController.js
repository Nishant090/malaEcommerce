const ErrorHandler = require("../utils/errorHandler");
const asyncError=require("../middleware/asyncError");
const User=require("../Models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto=require("crypto")
const sendEmails = require("../utils/sendEmail");


//register user
exports.registerUser=asyncError(async(req,res,next)=>{
    const{name,email,password}=req.body
    const user=await User.create({
        name,email,password,
        avatar:{
            public_id:"this is avatar",
            url:"profilePic"
        }
    })
    sendToken(user,201,res)
})

//LOgin

exports.loginUser=asyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    // checking both login credentals

    if(!email || !password){
        return next(new ErrorHandler("Please enter both email and password",400))

    }
    const user= await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid email and password",401))
    }
    const isPasswordMatched= await user.comparePassword(password)


    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid emailsssss and password",401))
    }
   sendToken(user,200,res)

})
//logout

exports.Logout=asyncError(async(req,res,next)=>{

res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
})


    res.status(200).json({
        success:true,
        message:"logout"
    })
})

//forgot password

exports.forgotPassword=asyncError(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user){
        return next( new ErrorHandler("user not found",404));
    }

    //get reset password token
  
    const resetToken= user.PasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message=`Your password reset token is:-\n\n${resetPasswordUrl}\n\n if you have not requested this email the,please ignore it`;
   
    try{
       

        await sendEmails({
            email:user.email,
            subject:`Ecommerce password recovery`,
            message,

        });
       res.status(200).json({
            success:true,
            message:`Email send to ${user.email} successfully`
        });

   }catch(error){
        
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
     return next( new ErrorHandler(error.message,500));
    }

})

//reset password
exports.resetPassword=asyncError(async(req,res,next)=>{
    //creating token hash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next( new ErrorHandler("reset password token is invalid or has been expired",404));
    }
    if(req.body.password!==req.body.confirmPassword){
        return next( new ErrorHandler("password does not match",404));

    }
user.password=req.body.password
user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save()
    sendToken(user,200,res)


})

//getUserDetails
exports.getUserDetails=asyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

    //update user password
exports.updateUserPassword=asyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password")
    const isPasswordMatched= await user.comparePassword(req.body.oldPassword)


    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect ",401))
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Passord doest not matched",401))
    }
    user.password=req.body.newPassword
    await user.save()

    sendToken(user,200,res)

})
//update profile
exports.updateUserProfile=asyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
   res.status(200).json({
    success:true
   })

})


//get all users(ADMIN)
exports.getUsers=asyncError(async(req,res,next)=>{
    const users =await User.find()
    res.status(200).json({
        sucess:true,
        users
    })

})

//get sinfgle users(ADMIN)
exports.getSingleUser=asyncError(async(req,res,next)=>{
    const user =await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler("User does not exists",404));
    }

    res.status(200).json({
        sucess:true,
        user
    })

})
//update role--admin
exports.updateUserRole=asyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user= await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    if(!user){
        return next(new ErrorHandler("User does not exists",404));
    }
   res.status(200).json({
    success:true
   })

})


//Delete user(Admin)
exports.DeleteUser=asyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id)

   if(!user){
        return next(new ErrorHandler("User does not exists",404));
    }
    await user.deleteOne();
   res.status(200).json({
    success:true
   })

})
