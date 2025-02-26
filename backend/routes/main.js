const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

router.get(
    "/api",
    asyncHandler(async (req, res) => {
        res.status(200).json({
            message: "LLM Project"
        });
    })
);

module.exports = router;