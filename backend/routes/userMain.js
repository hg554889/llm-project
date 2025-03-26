const express = require('express');
const router = express.Router();
const asynchandler = require('express-async-handler');
const User = require('../models/User');

// 특정 사용자 정보 조회 (이메일로 검색)
router.get('/:email',
    asynchandler(async (req, res) => {
        try {
            const userEmail = req.params.email;
            
            // 이메일로 사용자 검색
            const user = await User.findOne({ email: userEmail }).select('username email -_id');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: '해당 이메일의 사용자를 찾을 수 없습니다.'
                });
            }
            
            // 사용자 데이터 추출
            const { username, email } = user;
            
            // 성공 응답
            res.status(200).json({
                success: true,
                data: { username, email }
            });
        } catch (error) {
            console.error('사용자 정보 조회 중 오류 발생:', error);
            res.status(500).json({
                success: false,
                message: '서버 오류가 발생했습니다.'
            });
        }
    })
);

// 기존 라우터는 유지 (관리자용 또는 테스트용)
router.get('/',
    asynchandler(async (req, res) => {
        try {
            // 사용자 정보를 데이터베이스에서 가져옴 (이름과 이메일만)
            const users = await User.find({}).select('username email -_id');
            
            // 필요한 데이터만 추출하여 새 배열 생성
            const userList = users.map(user => {
                const { username, email } = user;
                return { username, email };
            });
            
            // 성공 응답
            res.status(200).json({
                success: true,
                count: userList.length,
                data: userList
            });
        } catch (error) {
            console.error('사용자 정보 조회 중 오류 발생:', error);
            res.status(500).json({
                success: false,
                message: '서버 오류가 발생했습니다.'
            });
        }
    })
);

module.exports = router;