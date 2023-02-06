const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const { doesNotMatch } = require("assert");
const { request } = require("https");

//Register a user

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const{name,email,password} =req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"This is sample id",
            url:"profilepicUrl"
        },
    });

    sendToken(user,201,res);
});
//Login User

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
        const {email,password} = req.body;

        //checking if user has given password and email both
        if(!email ||!password){
            return next(new ErrorHandler("Please enter email & password",400));
        }
        //If user doesn't exits
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Invalid email or password",401));
        }
        //If password doesn't match
        const isPasswordMatched = await user.comparePassword(password);
        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or password",401));
        }

        sendToken(user,200,res);
});

//Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Logged out User",
    });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
        )}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\n if you have not requested this email then please ignore it`;
    try{
        await sendEmail({
            email:user.email,
            subject:`Eccomerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} Successfully`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    //Creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or expired",400));
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }
    user.password =req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sendToken(user,200,res);
})

//Get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        sucess:true,
        user
    });
});
//update User Password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        if(!isPasswordMatched){
            return next(new ErrorHandler("old password is incorrect",401));
        }
        if(req.body.newPassword!==req.body.confirmPassword){
            return next(new ErrorHandler("Password  doesn't match",400));
        }
        user.password = req.body.newPassword;
        await user.save();
        sendToken(user,200,res);
    });

    //Update User Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
   
    const newUserData ={
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true, 
        context: 'query',
        useFindAndModify: false,      
    });
    res.status(200).json({
        success:true
    });
});

//Get All Users (admin)
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })

});
//Get single User (admin)
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with ID : {req.params.id}`));
    }
    
    res.status(200).json({
        success:true,
        user
    });

});
