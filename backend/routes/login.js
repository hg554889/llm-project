const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// 이메일 유효성 검사 함수
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 로그인 라우트
router.post('/', asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    // 입력값 검증
    if ((!email && !username) || !password) {
        return res.status(400).json({
            success: false,
            message: '이메일 또는 사용자명과 비밀번호를 입력해주세요.'
        });
    }

    try {
        let user;

        // 이메일 또는 사용자명으로 사용자 찾기
        if (email) {
            // 이메일 형식 검증
            if (!validateEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: '올바른 이메일 형식이 아닙니다.'
                });
            }
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: '등록되지 않은 사용자입니다.'
            });
        }

        // 비밀번호 검증
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: '비밀번호가 일치하지 않습니다.'
            });
        }

        // 로그인 성공
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            message: '로그인에 성공했습니다.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
            error: error.message
        });
    }
}));

module.exports = router;