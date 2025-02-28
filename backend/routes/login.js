const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// 회원가입 라우트
router.post('/register', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // 이메일 중복 체크
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새 사용자 생성
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: '회원가입이 완료되었습니다.'
        });
    } else {
        res.status(400).json({ message: '유효하지 않은 사용자 정보입니다.' });
    }
}));

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