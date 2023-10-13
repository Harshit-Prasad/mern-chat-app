import express from "express";
import {
  loginUser,
  registerUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, getAllUsers);
router.post("/login", loginUser);

export default router;
