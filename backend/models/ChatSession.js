const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, default: "새로운 채팅" },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }] // ✅ 추가됨!
});

chatSessionSchema.methods.updateTitle = async function (messageContent) {
  if (!this.title || this.title.trim() === '' || this.title === "새로운 채팅") {
    this.title = messageContent.substring(0, 50);
    await this.save();
  }
};

module.exports = mongoose.model('ChatSession', chatSessionSchema);
