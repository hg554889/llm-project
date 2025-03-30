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
    try {
        // 요청 데이터 확인
        console.log('로그인 요청 데이터:', req.body);
        const { username, email, password } = req.body;
        
        if (!password) {
            return res.status(400).json({
                success: false,
                message: '비밀번호를 입력해주세요.'
            });
        }

        let user;
        
        // 이메일 또는 사용자명으로 사용자 찾기
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            // 입력된 값이 이메일 형식인지 확인
            if (validateEmail(username)) {
                user = await User.findOne({ email: username });
            } else {
                user = await User.findOne({ username });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: '이메일 또는 사용자명을 입력해주세요.'
            });
        }

        // 사용자가 존재하지 않는 경우
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '등록되지 않은 사용자입니다.'
            });
        }
        
        // 비밀번호 검증
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: '비밀번호가 일치하지 않습니다.'
            });
        }
        
        // 사용자 정보 반환 (비밀번호 제외)
        const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        // 로그인 성공
        return res.status(200).json({
            success: true,
            message: '로그인 성공',
            user: userInfo
        });
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        return res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
            error: error.message
        });
    }
}));

module.exports = router;