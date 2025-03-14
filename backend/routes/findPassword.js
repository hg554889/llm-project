const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// 비밀번호 유효성 검사 함수
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

// 비밀번호 변경 라우트 (현재 비밀번호 입력 없이 새 비밀번호로 변경)
router.post('/', asyncHandler(async (req, res) => {
    const { username, newPassword } = req.body;

    // 입력값 검증
    if (!username || !newPassword) {
        return res.status(400).json({
            success: false,
            message: '사용자명과 새 비밀번호를 입력해주세요.'
        });
    }

    // 새 비밀번호 유효성 검사
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        return res.status(400).json({
            success: false,
            message: `새 비밀번호는 ${passwordValidation.errors.join(', ')}를 포함해야 합니다.`
        });
    }

    // 사용자 찾기
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다.'
        });
    }

    // 새 비밀번호 해시화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 비밀번호 업데이트
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
    });
}));

module.exports = router;