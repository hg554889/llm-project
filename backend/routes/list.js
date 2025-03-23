const express = require('express');
const router = express.Router();
const axios = require('axios');
const asyncHandler = require("express-async-handler");

router.get(
    "/beakjoon",
    asyncHandler(async (req, res) => {
        const { tag } = req.query;

        if (!tag) {
            return res.status(400).json({ error: "검색할 태그(tag)를 입력하세요." });
        }

        try {
            const query = `tag:${tag} level:..8`;
            const apiUrl = `https://solved.ac/api/v3/search/problem?query=${encodeURIComponent(query)}`;
            const response = await axios.get(apiUrl);

            // 🔽 level 8 이하로 서버 쪽에서 한 번 더 필터링
            const problemsWithLinks = response.data.items
                .filter(problem => problem.level <= 8)
                .map(problem => ({
                    problemId: problem.problemId,
                    titleKo: problem.titleKo,
                    level: problem.level,
                    tags: problem.tags.map(tag => tag.key),
                    link: `https://www.acmicpc.net/problem/${problem.problemId}`
                }));

            res.status(200).json(problemsWithLinks);
        } catch (error) {
            res.status(error.response?.status || 500).json({ error: "문제 검색 실패" });
        }
    })
);

module.exports = router;
