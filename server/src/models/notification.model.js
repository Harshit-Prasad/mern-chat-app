import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    for: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
