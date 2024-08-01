const express = require("express");
const Message = require("../model/messagemodel");
const router = express.Router();
const {
  newMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} = require("../controller/messagecontroller");
const { jsonAuthMiddleware } = require("../authorization/auth.js");

// Post a message
router.post("/message", jsonAuthMiddleware, newMessages);

// Get messages by user
router.get("/messages/:userId", jsonAuthMiddleware, getMessage);

// Update a message
router.put("/message/:id", jsonAuthMiddleware, updateMessage);

// Delete a message
router.delete("/message/:id", jsonAuthMiddleware, deleteMessage);

module.exports = router;
