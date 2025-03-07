const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// 로그인 라우트
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ email });

    // 사용자가 존재하고 비밀번호가 일치하는지 확인
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: '로그인 성공'
        });
    } else {
        res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }
}));

module.exports = router; 