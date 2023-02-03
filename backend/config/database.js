const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

//Promise method
// const connectDatabase = ()=>{
//     console.log(process.env.DB_URI);
// mongoose.connect("process.env.DB_URI",
// {useNewUrlParser:true,useUnifiedTopology:true}).then
// ((data)=>{
//         console.log(`MongoDB connected with server: ${data.connection.host}`);
//     }).catch((err)=>{
//         console.log(err);
//     })
// }
//Async Await method
const connectDatabase = async()=>{
    console.log(process.env.DB_URI);
    try{
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`mongodb server is running : ${conn.connection.host}`);

    }
    catch(err){
        console.log(err);
    }
};
module.exports = connectDatabase;