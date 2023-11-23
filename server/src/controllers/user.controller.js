import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import getJWT from "../config/jwt.js";

// @Description     Register new user
// @Route           POST /api/user/
// @Access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, bgColor } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    bgColor,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bgColor: user.bgColor,
      token: getJWT(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@Description     Login the user
//@Route           POST /api/users/login
//@Access          Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bgColor: user.bgColor,
      token: getJWT(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @Description     Get all users
// @Route           GET /api/user?search=something
// @Access          Public
const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.send(users);
});

export { registerUser, loginUser, getAllUsers };
