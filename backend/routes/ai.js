const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const axios = require("axios");
require("dotenv").config();

// Flask 서버 URL (환경변수 FLASK_SERVER_URL이 설정되어 있지 않으면 기본값 http://localhost:5000 사용)
const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || "http://localhost:5000";

// 기본 경로: GET /
router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.status(200).send("AI Page");
    })
);

// /generate 엔드포인트: 클라이언트로부터 질문을 받아 Flask 서버의 /chat 엔드포인트로 전달
router.post(
    '/generate',
    asyncHandler(async (req, res) => {
        const { textGen } = req.body;
        if (!textGen) {
            return res.status(400).json({ message: "질문 텍스트가 제공되지 않았습니다." });
        }

        // Flask 서버의 /chat 엔드포인트 URL 구성
        const chatEndpoint = `${FLASK_SERVER_URL}/chat`;

        try {
            // Flask 서버에 POST 요청 (JSON 형식: { question: "질문 내용" })
            const response = await axios.post(chatEndpoint, { question: textGen }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // 60초 타임아웃
            });

            // Flask 서버 응답 구조: { original_question, translated_question, response }
            const { original_question, translated_question, response: chatbotResponse } = response.data;

            return res.status(200).json({
                original_input: textGen,
                translated_input: translated_question,
                chatbot_response: chatbotResponse
            });
        } catch (err) {
            console.error("Flask 서버와의 통신 중 오류 발생:", err.message);
            return res.status(500).json({ message: `Flask 서버와의 통신 중 오류 발생: ${err.message}` });
        }
    })
);

module.exports = router;