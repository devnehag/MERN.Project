const app = require("./app");

const dotenv = require("dotenv"); //installed dotenv from npm for config file.
const connectDatabase = require("./config/database")
//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})
//Config
dotenv.config({path:"backend/config/config.env"});

//connecting to database
connectDatabase(); //Calling this after config file as it is using value from config file

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//Unhandled promise Rejection
process.on("unhandledRejection", err=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down server due to unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    });
});