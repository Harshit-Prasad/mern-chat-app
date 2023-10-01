import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", loginUser);

export { router };
