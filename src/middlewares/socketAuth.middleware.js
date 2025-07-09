import jwt from 'jsonwebtoken';
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import cookie from 'cookie';

export const socketAuth = async (socket, next) => {
    try {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) {
            return next(new Error("Unauthorized: No cookies sent"));
        }
        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies['accessToken']; // Use your actual cookie name

        if (!token) {
            return next(new Error("Unauthorized: No access token"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return next(new Error("Unauthorized: Invalid user"));
        }

        socket.user = user; // Attach user to socket
        next();
    } catch (error) {
        return next(new Error("Unauthorized: Invalid Access Token"));
    }
};