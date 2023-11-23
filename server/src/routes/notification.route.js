import { Router } from "express";
import { protect } from "../middlewares/authentication.middleware.js";
import {
  getNotifications,
  sendNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/").get(protect, getNotifications);
router.route("/").post(protect, sendNotification);
// router.route('/').delete(protect, deleteNotification)
// router.route('/deleteAll').delete(protect, deleteAllNotifications)

export default router;
