const mongoose  = require("mongoose");
const validator = require("validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const { use } = require("../app");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name cannot be exceed 30 characters"],
        minLength:[4,"Name cannot be less than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your password"],
        minLength:[8,"Password cannot be less than 8 characters"],
        select:false
    },
    avatar:{
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
        default:"user",
        },
    resetPasswordToken :String,
    resetPasswordExpire:Date,
});
// userSchema.pre("save",async function(next){
//     if(!this.isModified("password")){
//         next();
//     }
//     this.password = await bcrypt.hash(this.password,10);
// });

// //JWT Token
// userSchema.methods.getJWTToken = function(){
//     return jwt.sign({id:this._id},process.env.JWT_SECRET,{
//         expiresIn:process.env.JWT_EXPIRE,

//     });
// }

module.exports = mongoose.model("User",userSchema);