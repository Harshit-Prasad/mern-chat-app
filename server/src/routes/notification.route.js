import { Router } from "express";
import { protect } from "../middlewares/authentication.middleware.js";
import {
  getNotifications,
  sendNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/").get(protect, getNotifications);
router.route("/").post(protect, sendNotification);
router.route("/").delete(protect, deleteAllNotifications);
router.route("/:id").delete(protect, deleteNotification);

export default router;
