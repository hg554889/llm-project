const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { HfInference } = require('@huggingface/inference');
require("dotenv").config();

// API 키 검증
const API_KEY = process.env.HF_API_KEY;
if (!API_KEY) {
    throw new Error('HF_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

// Hugging Face 클라이언트 초기화
const hf = new HfInference(API_KEY);

// 기본 경로
router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.status(200).send("AI Page");
    })
);

// 텍스트 생성 라우트
router.post('/generate', async (req, res) => {
    const { textGen, modelName = 'scm104/pychatbot' } = req.body;
    console.log(`Input for text generation: "${textGen}" using model: ${modelName}`);
    
    // 60초 타임아웃 설정
    const TIMEOUT = 60000;
    
    try {
        // 요청 파라미터 설정
        const requestParams = {
            model: modelName,
            inputs: textGen,
            parameters: {
                max_new_tokens: 100,
                temperature: 0.7,
                top_p: 0.9,
                top_k: 50,
                repetition_penalty: 1.2
            }
        };
        
        console.log('Request parameters:', JSON.stringify(requestParams));
        
        // 타임아웃이 있는 API 호출
        const responsePromise = hf.textGeneration(requestParams);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), TIMEOUT)
        );
        
        const response = await Promise.race([responsePromise, timeoutPromise]);
        
        console.log('API Response received:', JSON.stringify(response));
        
        // 응답 처리
        if (!response || !response.generated_text) {
            throw new Error('No valid response from model');
        }
        
        // 응답에서 생성된 텍스트 추출 및 후처리
        const generatedText = response.generated_text;
        const finalText = removeRepetitions(generatedText);
        
        console.log('Processed text:', finalText);
        
        res.status(200).json({ 
            response: finalText,
            model: modelName,
            original_input: textGen
        });
        
    } catch (err) {
        // 자세한 오류 정보 로깅
        console.error('Error in text generation:', err.message);
        
        // 오류 객체의 모든 속성 추출하여 로깅
        const errorDetails = {};
        Object.getOwnPropertyNames(err).forEach(key => {
            errorDetails[key] = err[key];
        });
        console.error('Error details:', JSON.stringify(errorDetails, null, 2));
        
        // 오류 종류에 따른 응답 처리
        if (err.message.includes('timed out')) {
            res.status(504).json({
                message: '요청 시간이 초과되었습니다.',
                model: modelName
            });
        } else if (err.message.includes('not exist') || err.message.includes('not found')) {
            // 모델이 없는 경우 fallback 실행
            try {
                console.log('Attempting fallback to gpt2 model...');
                const fallbackResponse = await hf.textGeneration({
                    model: 'gpt2',
                    inputs: textGen,
                    parameters: {
                        max_new_tokens: 100,
                        temperature: 0.7
                    }
                });
                
                const fallbackText = removeRepetitions(fallbackResponse.generated_text);
                res.status(200).json({ 
                    response: fallbackText,
                    model: 'gpt2 (fallback)',
                    original_input: textGen,
                    note: '요청한 모델을 찾을 수 없어 GPT-2 모델로 대체되었습니다.'
                });
            } catch (fallbackErr) {
                res.status(500).json({
                    message: `원본 모델과 대체 모델 모두 실패: ${err.message}`,
                    fallbackError: fallbackErr.message
                });
            }
        } else {
            res.status(500).json({
                message: `텍스트 생성 중 오류 발생: ${err.message}`,
                model: modelName
            });
        }
    }
});

// 모델 정보 확인 라우트 추가
router.get('/models/info', async (req, res) => {
    const { modelName } = req.query;
    
    if (!modelName) {
        return res.status(400).json({ message: '모델 이름이 필요합니다.' });
    }
    
    try {
        // 모델 정보 요청 - Hugging Face API에서 지원하는 경우
        const response = await fetch(`https://huggingface.co/api/models/${modelName}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`모델 정보를 가져올 수 없습니다: ${response.statusText}`);
        }
        
        const modelInfo = await response.json();
        res.status(200).json(modelInfo);
    } catch (err) {
        console.error('Error fetching model info:', err);
        res.status(500).json({ message: err.message });
    }
});

// 중복 제거 유틸리티 함수
function removeRepetitions(text) {
    if (!text) return '';
    const sentences = text.split('. ');
    const uniqueSentences = [...new Set(sentences)];
    return uniqueSentences.join('. ');
}

module.exports = router;