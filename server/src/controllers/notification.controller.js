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
        path: "from",
        select: "name bgColor",
      })
      .populate({
        path: "chat",
        populate: {
          path: "users",
        },
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
    const { from, to, chat } = req.body;

    const notification = await Notification.findOne({
      from,
      to,
    });

    if (notification) {
      await Notification.deleteOne({
        from,
        to,
      });
    }

    let newNotification = await Notification.create({ from, to, chat });
    newNotification = await newNotification.populate({
      path: "from",
      select: "name bgColor",
    });
    newNotification = await newNotification.populate({
      path: "chat",
      populate: {
        path: "users",
      },
    });

    res.send(newNotification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @Description     Delete a notification
// @Route           DELETE /api/notifications/:id
// @Access          Private
const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const { acknowledged } = await Notification.deleteOne({ _id: id });

    res.send({ ok: acknowledged });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @Description     Delete all notifications
// @Route           DELETE /api/notifications/
// @Access          Private
const deleteAllNotifications = asyncHandler(async (req, res) => {
  try {
    const { user } = req;

    const { acknowledged } = await Notification.deleteMany({ to: user._id });

    res.send({ ok: acknowledged });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export {
  getNotifications,
  sendNotification,
  deleteAllNotifications,
  deleteNotification,
};
