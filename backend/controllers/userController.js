const ErrorHandler = require("../utils/errorhandler");
const catchAsynchErrors = require("../middleware/catchAsynchErrors");
const User = require("../models/userModels");


//Register a user

exports.registerUser = catchAsynchErrors(async(req,res,next)=>{
    const{name,email,password} =req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"This is sample id",
            url:"profilepicUrl"
        }
    });

    //const token =user.getJWTToken();

    res.status(201).json({
        success:true,
        user,
    });
});