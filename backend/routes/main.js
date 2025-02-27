const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.status(200).send("Main Page");
    })
);

module.exports = router;