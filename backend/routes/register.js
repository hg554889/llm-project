const express = require("express")
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 비밀번호 검증 함수
const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    if (password.length < minLength) errors.push(`최소 ${minLength}자 이상`);
    if (!hasNumber) errors.push('숫자');
    if (!hasSpecial) errors.push('특수문자');
    
    return {
        isValid: password.length >= minLength && hasNumber && hasSpecial,
        errors
    };
};

// 회원가입 라우트
router.post('/', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // 기본 입력값 검증
    if (!username || !email || !password) {
        return res.status(400).json({ 
            message: '모든 필드를 입력해주세요.' 
        });
    }

    // 비밀번호 유효성 검사
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ 
            message: `비밀번호는 ${passwordValidation.errors.join(', ')}를 포함해야 합니다.` 
        });
    }

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

module.exports = router;