const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const axios = require("axios");
require("dotenv").config();

// Flask 서버 URL들 설정
const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || "http://localhost:5000";
const BACKUP_AI_SERVER_URL = "http://localhost:6000";

// /generate 엔드포인트 수정
router.post(
    '/generate',
    asyncHandler(async (req, res) => {
        const { textGen } = req.body;
        if (!textGen) {
            return res.status(400).json({ message: "질문 텍스트가 제공되지 않았습니다." });
        }

        try {
            // 첫 번째 AI 서버에 요청
            const chatEndpoint = `${FLASK_SERVER_URL}/chat`;
            const response = await axios.post(chatEndpoint, { question: textGen }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            });

            const { original_question, translated_question, response: chatbotResponse } = response.data;

            // 'I cannot find' 문구가 포함되어 있는지 확인
            if (chatbotResponse.includes('찾을 수 없습니다.')) {
                // 두 번째 AI 서버에 요청
                const backupResponse = await axios.post(`${BACKUP_AI_SERVER_URL}/ask`, 
                    { question: textGen },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 60000
                    }
                );

                return res.status(200).json({
                    original_input: textGen,
                    translated_input: translated_question,
                    chatbot_response: backupResponse.data.response || backupResponse.data
                });
            }

            return res.status(200).json({
                original_input: textGen,
                translated_input: translated_question,
                chatbot_response: chatbotResponse
            });

        } catch (err) {
            console.error("AI 서버와의 통신 중 오류 발생:", err.message);
            return res.status(500).json({ message: `AI 서버와의 통신 중 오류 발생: ${err.message}` });
        }
    })
);

module.exports = router;