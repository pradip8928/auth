import {asyncHandler}  from  "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
 import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser =asyncHandler( async (req, res) => {
// grab user detail from the frontend 
// add validation -not empty
// check wheather user exist -username or email
// check for images ,for  avatar file
// upload them on cloudinary 
// create user object -create entry in db 
// remove password and refreshtoken from response 
// return response
 // username,email,fullName,avatar,coverImage,password


    console.log(req.body);
    
    const {username,email,fullName,password} = req.body;
    if([username,email,fullName,password].some((field) => field?.trim() ==="")){
        throw new ApiError(400,"All fields are required");
    }

   const existedUser = User.findOne({ 
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required");
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(avatar){
        throw new ApiError(400,"Avatar file is required");
    }

   const user=await  User.create( {
                    username:username.toLowerCase(),
                    email,
                    fullName,
                    password,
                    avatar:avatar.url,
                    coverImage:coverImage?.url ||"",
                })
    

    const createdUser=await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }


    return res.status(201).json(
        new ApiResponse(200,"User registered successfully")
    )

})

export {registerUser}