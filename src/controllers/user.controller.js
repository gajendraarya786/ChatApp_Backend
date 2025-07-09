import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
       const user =  await User.findById(userId);
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
       
       user.refreshToken = refreshToken;
       await user.save({validateBeforeSave: false});
       
       return {accessToken, refreshToken};

    } catch (error) {
         console.error("generateAccessAndRefreshTokens error:", error); 
        throw new ApiError(500, "Something went wrong while generation refresh and access token")
    }

}

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.FOUND).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

// ---------------------- LOGIN ----------------------
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Username and password required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid password" });
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
        
      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
       
       //sending cookies
       const options = {
        httpOnly: true,
        secure: true
       }

       return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
       .json(
        new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully")
       )

  } catch (err) {
    console.error("Login error:", err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { register, login };
