const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler");

router.get("/", asynchandler(async (req, res) => {
    res.status(200).send("QnA Page");
}));

module.exports = router;