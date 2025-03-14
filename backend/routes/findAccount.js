const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// ID 찾기 라우트
router.post('/find-username', asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: '이메일을 입력해주세요.'
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: '등록되지 않은 이메일입니다.'
        });
    }

    res.status(200).json({
        success: true,
        username: user.username,
        message: '사용자 이름을 찾았습니다.'
    });
}));

// 이메일 찾기 라우트
router.post('/find-email', asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            success: false,
            message: '사용자명을 입력해주세요.'
        });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: '등록되지 않은 사용자명입니다.'
        });
    }

    // 이메일 마스킹 처리
    const emailParts = user.email.split('@');
    const maskedEmail = `${emailParts[0].substring(0, 3)}***@${emailParts[1]}`;

    res.status(200).json({
        success: true,
        email: maskedEmail,
        message: '이메일을 찾았습니다.'
    });
}));

module.exports = router;