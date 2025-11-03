import asyncHandler from "../utils/asyncHandler.js";
// import { upload } from "../middlewares/multer.middleware.js";
import ApiErrors from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  // console.log("Received registration data:", req.body);
  // console.log(`Registering user: ${username}, Email: ${email}`);

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(400, "Field is required");
  }
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiErrors(409, "User already exists");
  }

  const avatarLocalpath = req.files?.avatar[0]?.path;
  // const coverImageLocalpath = req.files?.coverImage[0]?.path; //so coverImage is not needed we can do it new logic so we can not face undefine error
  let coverImageLocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalpath = req.files.coverImage[0].path;
  }
  // console.log("req.files content:", req.files);
  if (!avatarLocalpath) {
    throw new ApiErrors(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);
  if (!avatar) {
    throw new ApiErrors(500, "Failed to upload avatar image");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage ? coverImage.url : "",
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiErrors(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));

  const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email) {
      throw new ApiErrors(400, "All fields are required for login");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      throw new ApiErrors(404, "User not found");
    }
  });
});

export default registerUser;
