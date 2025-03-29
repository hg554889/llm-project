const express = require('express');
const router = express.Router();
const axios = require('axios');
const asyncHandler = require("express-async-handler");

router.get(
    "/beakjoon",
    asyncHandler(async (req, res) => {
        let { tag } = req.query;
        console.log('Received tag:', tag);

        if (!tag) {
            return res.status(400).json({ error: "검색할 태그(tag)를 입력하세요." });
        }

        // 태그가 여러 개인 경우 OR 연산자를 사용하여 쿼리 생성
        const tags = tag.split(' ').map(t => `tag:${t}`).join(' OR ');
        const query = `${tags}`; // 레벨 제한 제거

        try {
            const apiUrl = `https://solved.ac/api/v3/search/problem?query=${encodeURIComponent(query)}`;
            console.log('Requesting URL:', apiUrl);

            const response = await axios.get(apiUrl);
            
            if (!response.data || !response.data.items) {
                console.error('solvedac API 응답:', response.data);
                return res.status(404).json({ error: "문제를 찾을 수 없습니다." });
            }

            const problemsWithLinks = response.data.items
                .map(problem => ({ // 레벨 필터링 제거
                    problemId: problem.problemId,
                    titleKo: problem.titleKo,
                    level: problem.level,
                    tags: problem.tags.map(tag => tag.key),
                    link: `https://www.acmicpc.net/problem/${problem.problemId}`
                }));

            console.log(`Found ${problemsWithLinks.length} problems for tag: ${tag}`);
            res.status(200).json(problemsWithLinks);
        } catch (error) {
            console.error('Search error:', error);
            res.status(error.response?.status || 500).json({ 
                error: "문제 검색 실패",
                details: error.message 
            });
        }
    })
);

module.exports = router;
