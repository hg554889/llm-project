const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// ID 찾기 라우트
router.post('/', asyncHandler(async (req, res) => {
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
        message: '아이디를 찾았습니다.'
    });
}));

module.exports = router;