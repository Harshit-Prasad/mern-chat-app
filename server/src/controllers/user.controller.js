import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import getJWT from "../config/jwt.js";

// @description     Register new user
// @route           POST /api/user/
// @access          Public
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, password, color } = req.body;

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
    color,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      color: user.color,
      token: getJWT(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Login the user
//@route           POST /api/users/login
//@access          Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      color: user.color,
      token: getJWT(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @description     Get all users
// @route           GET /api/user?search=
// @access          Public
const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

export { registerUser, loginUser, getAllUsers };
