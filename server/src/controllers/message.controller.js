import asyncHandler from "express-async-handler";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

// @Description     Send new message
// @Route           POST /api/message/
// @Access          Private
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.sendStatus(400);
    return;
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name bgColor");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name bgColor email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.send(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @Description     Get all messages of a chat
// @Route           GET /api/chat/:chatId
// @Access          Private
const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name bgColor email")
      .populate("chat");

    res.send(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { sendMessage, getMessages };
