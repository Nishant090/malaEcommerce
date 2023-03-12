const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name should not excceed 30 characters"],
        minLength:[3,"Name should have more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your E-mail"],
        unique:true,
        validate:[validator.isEmail,"please enter valid E-mail"]
    },
    password:{
        type:String,
        required:[true,"Please enter your Password"],
        minLength:[7,"Password should have more than 8 characters"],
        select:false
        
    },
    avatar:
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        },
        role:{
            type:String,
            default:"user"
        },
       resetPasswordToken:String,
       resetPasswordExpire:Date
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hashSync(this.password,10);
})

//jwt token
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })

}
//compare password
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

}

//generating password reset token

userSchema.methods.PasswordToken= function(){
    //generatting token
    const resetToken=crypto.randomBytes(20).toString("hex")
    
    //hasing an adding to userschema
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire=Date.now()+15*60*1000
    
    return resetToken

}

module.exports=mongoose.model("User",userSchema)