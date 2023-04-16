const express= require("express")
const App=express();
const cookieParser=require("cookie-parser")
const errorMiddleware=require("./middleware/error")

App.use(express.json())
App.use(cookieParser())


//importing routes
const products=require("./Routes/ProductRoute")
const user=require("./Routes/userRoute")
const order=require("./Routes/orderRoute")
App.use("/api/v1",products)
App.use("/api/v1",user)
App.use("/api/v1",order)



// middle ware for error
App.use(errorMiddleware)

module.exports=App 