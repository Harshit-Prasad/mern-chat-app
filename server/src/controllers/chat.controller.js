import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

// @Description     Get all chats
// @Route           GET /api/chat/
// @Access          Private
const getChat = asyncHandler(async (req, res) => {
  try {
    let chat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate({
        path: "users",
        select: "-password",
      })
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name bgColor email",
    });

    res.send(chat);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
});

// @Description     Create new chat
// @Route           POST /api/chat/
// @Access          Private
const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export { createChat, getChat };
