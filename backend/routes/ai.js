const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const axios = require("axios");
require("dotenv").config();

// Flask 서버 URL들 설정
const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || "http://localhost:5000";
const BACKUP_AI_SERVER_URL = process.env.BACKUP_AI_SERVER_URL || "http://localhost:6000";

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
            let finalResponse;
            try {
                const chatEndpoint = `${FLASK_SERVER_URL}/chat`;
                const response = await axios.post(chatEndpoint, { question: textGen }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 60000
                });

                const { original_question, translated_question, response: chatbotResponse } = response.data;

                // 응답이 적절하지 않은 경우 백업 서버 사용
                if (chatbotResponse.includes('찾을 수 없습니다.') || !chatbotResponse.trim()) {
                    throw new Error('First AI response not satisfactory');
                }

                finalResponse = {
                    original_input: textGen,
                    translated_input: translated_question,
                    chatbot_response: chatbotResponse
                };
            } catch (error) {
                // 첫 번째 서버 실패 시 백업 서버 사용
                console.log('Switching to backup AI server...');
                const backupResponse = await axios.post(
                    `${BACKUP_AI_SERVER_URL}/ask`, 
                    { question: textGen },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 60000
                    }
                );

                // 백업 서버 응답 형식 통일화
                const backupAnswer = backupResponse.data.answer || backupResponse.data.response || backupResponse.data;
                finalResponse = {
                    original_input: textGen,
                    translated_input: textGen,
                    chatbot_response: typeof backupAnswer === 'object' ? JSON.stringify(backupAnswer) : backupAnswer
                };
            }

            return res.status(200).json(finalResponse);

        } catch (err) {
            console.error("AI 서버 통신 오류:", err.message);
            return res.status(500).json({
                message: "AI 서버 응답 처리 중 오류가 발생했습니다.",
                error: err.message
            });
        }
    })
);

module.exports = router;