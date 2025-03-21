const express = require('express');
const router = express.Router();
const axios = require('axios');
const asyncHandler = require("express-async-handler");

router.get(
    "/beakjoon",
    asyncHandler(async (req, res) => {
        const { tag } = req.query; // 프론트엔드에서 태그 받아오기

        if (!tag) {
            return res.status(400).json({ error: "검색할 태그(tag)를 입력하세요." });
        }

        try {
            // solved.ac API 호출 (태그 기반 검색)
            const apiUrl = `https://solved.ac/api/v3/search/problem?query=tag:${tag}`;
            const response = await axios.get(apiUrl);

            // 응답 데이터를 가공하여 문제 링크 추가
            const problemsWithLinks = response.data.items.map(problem => ({
                problemId: problem.problemId,
                titleKo: problem.titleKo,
                level: problem.level,
                tags: problem.tags.map(tag => tag.key), // 태그 키만 추출
                link: `https://www.acmicpc.net/problem/${problem.problemId}` // 백준 문제 링크 추가
            }));

            res.status(200).json(problemsWithLinks); // 수정된 데이터 반환
        } catch (error) {
            res.status(error.response?.status || 500).json({ error: "문제 검색 실패" });
        }
    })
);

module.exports = router;
