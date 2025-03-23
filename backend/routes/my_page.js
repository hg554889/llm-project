const express = require('express');
const router = express.Router();
const asynchandler = require('express-async-handler');
const User = require('../models/User');
const memo = require('../models/memo');

router.get('/', asynchandler(async (req, res) => {
        // JWT 토큰에서 사용자 정보 추출
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        const memos = await memo.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            user: {
                username: user.username,
                email: user.email
            },
            memos: memos
        });
    }
));

module.exports = router;