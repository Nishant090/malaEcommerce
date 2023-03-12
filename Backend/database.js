const mongoose=require("mongoose");
const connectDB=( )=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{

        console.log(`connected:${data.connection.host}`)
        })
        
}
module.exports=connectDB