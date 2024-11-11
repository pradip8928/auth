import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema=new Schema(
    {
        username: {
          type:String,
          required:[true,"username is required"],
          unique:true,
          lowercase:true,
          trim:true,
          index:true,  
        },
        email: {
          type:String,
          required:[true,"email is required"],
          unique:true,
          lowercase:true,
          trim:true,    
        },
        fullName: {
          type:String,
          required:[true,"fullname is required"],
          trim:true,    
        },
        avatar:{
            type:String,//cloudinary
            required:[true,"Avatar image is required"],
        },
        coverImage: {
            type:String,//cloudinary
        },
        password:{
          type:String,
          required:[true,"Password is required"]
        },
        refreshToken: {
          type:String,
          
        }
        

    },{
      timestamps:true,
    }
)

userSchema.pre("save",async function(next){
  if(!this.password.isModified("password")) return next();
  this.password=await bcrypt.hash(this.password,10);
  next();
})

userSchema.methods.isPasswordCorrect=async function(password){
 return  await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=async function(){
  return await jwt.sign(
    {
      _id:this._id,
      email:this.email,
      fullName:this.fullName,
      username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefreshToken=async function(){
  return await jwt.sign(
    {
      _id:this._id,
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User=mongoose.model("User",userSchema);