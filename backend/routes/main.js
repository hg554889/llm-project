const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.status(200).json({
            message: "Main Page"
        });
    })
);

module.exports = router;