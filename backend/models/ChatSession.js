const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, default: "새로운 채팅" },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
