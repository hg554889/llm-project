const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/User"); // User 모델 import 추가
require("dotenv").config();

// 계정 찾기 라우트 추가
router.post('/', asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    if (!username && !email) {
        return res.status(400).json({
            message: "username 또는 email을 입력해주세요."
        });
    }

    try {
        let user;
        let searchResult = {};

        if (username) {
            // username으로 검색
            user = await User.findOne({ username });
            if (user) {
                searchResult = {
                    found: true,
                    email: user.email
                };
            }
        } else if (email) {
            // email로 검색
            user = await User.findOne({ email });
            if (user) {
                searchResult = {
                    found: true,
                    username: user.username
                };
            }
        }

        if (!user) {
            return res.status(404).json({
                message: "계정을 찾을 수 없습니다.",
                found: false
            });
        }

        res.status(200).json({
            message: "계정을 찾았습니다.",
            ...searchResult
        });

    } catch (error) {
        console.error("계정 검색 중 오류 발생:", error);
        res.status(500).json({
            message: "서버 오류가 발생했습니다.",
            error: error.message
        });
    }
}));

module.exports = router;