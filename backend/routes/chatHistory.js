const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');

// 새로운 채팅 세션 생성
router.post('/session', async (req, res) => {
  const { userEmail } = req.body;
  try {
    const session = new ChatSession({ userEmail });
    await session.save();
    res.json({ success: true, sessionId: session._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 사용자의 채팅 세션 목록 조회
router.get('/sessions', async (req, res) => {
  const { userEmail } = req.query;
  try {
    const sessions = await ChatSession.find({ userEmail })
      .sort({ lastMessageAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 특정 세션의 메시지 목록 조회
router.get('/messages/:sessionId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ timestamp: 1 }); // 시간순 정렬
    if (!messages) {
      return res.status(404).json({ success: false, error: '메시지를 찾을 수 없습니다.' });
    }
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 새 메시지 저장
router.post('/message', async (req, res) => {
  const { sessionId, role, content } = req.body;
  try {
    const message = new ChatMessage({ sessionId, role, content });
    await message.save();
    
    // 세션의 lastMessageAt 업데이트
    await ChatSession.findByIdAndUpdate(sessionId, { 
      lastMessageAt: new Date(),
      // 첫 번째 사용자 메시지를 제목으로 설정
      $set: { 
        title: role === 'user' ? content.substring(0, 50) : undefined 
      }
    });

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 세션 삭제 (관련 메시지도 함께 삭제)
router.delete('/session/:sessionId', async (req, res) => {
  try {
    await ChatMessage.deleteMany({ sessionId: req.params.sessionId });
    await ChatSession.findByIdAndDelete(req.params.sessionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;