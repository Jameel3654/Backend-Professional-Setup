import ApiErrors from "../utils/ApiErrors";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiErrors(401, "Unauthorized: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken.userId).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiErrors(401, "Invalid Access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiErrors(401, "Invalid Access token");
  }
});

export default verifyJWT;
