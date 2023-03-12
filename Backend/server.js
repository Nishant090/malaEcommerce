const App = require("./App");
const dotenv=require("dotenv");
const connectDB=require("./database");

//handling uncaught error
process.on("uncaughtException",(err)=>{
    console.log(`error:${err.message}`)
    console.log(`shutting down the server due to uncaught error`)
    process.exit(1)
})


//config path
dotenv.config({path:"Backend/config/config.env"})



//connecting database

connectDB();


const server = App.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


//unhandeled promise Rejection

process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server`)
    server.close(()=>{
        process.exit(1)
    })
})