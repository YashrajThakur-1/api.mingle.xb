require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const socketIo = require("socket.io");
const db = require("./database/db");
const port = process.env.PORT;
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authroutes");
const messageroutes = require("./routes/messageroutes");
const Message = require("./model/messagemodel");

// forimageUploads
app.use(express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Access the all https frontend urls
app.use(
  cors({
    origin: "*", // Consider replacing "*" with specific domains
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
  })
);
const io = socketIo(http, {
  cors: {
    origin: "*", // You can specify your client's domain here
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});
io.on("sendMessage", async (data) => {
  try {
    console.log("sendMessage event received with data:", data);
    const newMessage = new Message({
      ...data,
      sender: data?.senderId,
      receiver: data?.receiverId,
    });
    await newMessage.save();

    io.to(data.receiverId).emit("receiveMessage", newMessage);
    console.log("Message sent and saved:", newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  }
});
//Routes Manage
app.use("/api/auth", authRoutes);
app.use("/api/chat", messageroutes);

//starting The Server
http.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
