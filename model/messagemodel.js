const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sendAt: {
    type: Date,
    default: Date.now,
  },
  day: {
    type: String,
  },
  time: {
    type: String,
  },
  date: {
    type: String,
  },
});

messageSchema.pre("save", function (next) {
  const now = this.sendAt || new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  this.day = now.toLocaleDateString("en-US", { weekday: "long" });
  this.time = now.toLocaleTimeString("en-US");
  this.date = now.toLocaleDateString("en-US", options);
  next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
