import asyncHandler from "express-async-handler";
import { Notification } from "../models/notification.model.js";

// @Description     Get all notifications
// @Route           GET /api/notifications/
// @Access          Private
const getNotifications = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    const notifications = await Notification.find({
      to: user._id,
    })
      .populate({
        path: "for",
        populate: {
          path: "sender",
          select: "-password",
        },
      })
      .populate({
        path: "to",
        select: "name bgColor",
      });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @Description     Create new notifications
// @Route           POST /api/notifications/
// @Access          Private
const sendNotification = asyncHandler(async (req, res) => {
  try {
    const { message, userId } = req.body;

    const newNotification = {
      for: message,
      to: userId,
    };

    await Notification.create(newNotification);

    res.send({ ok: true });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { getNotifications, sendNotification };
