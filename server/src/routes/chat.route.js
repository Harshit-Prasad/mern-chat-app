import express from "express";
import { protect } from "../middlewares/authentication.middleware.js";
import { createChat, getChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.route("/").post(protect, createChat).get(protect, getChat);

export default router;
