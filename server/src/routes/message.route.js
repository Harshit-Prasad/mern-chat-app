import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { protect } from "../middlewares/authentication.middleware.js";

const router = Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, getMessages);

export default router;
