const Message = require("../model/messagemodel");

const newMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiver, message } = req.body;
    const newMessage = new Message({
      sender: userId,
      receiver,
      message,
    });
    await newMessage.save();
    res
      .status(200)
      .json({ data: newMessage, msg: "Message sent", status: true });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });
    res.status(200).json({ data: messages, status: true });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateMessage = async () => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ msg: "Message not found", status: false });
    }
    res
      .status(200)
      .json({ data: updatedMessage, msg: "Message updated", status: true });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ msg: "Message not found" });
    }
    res.status(200).json({ msg: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { newMessages, getMessage, updateMessage, deleteMessage };
