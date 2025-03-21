const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Memo = require("../models/memo");
const User = require("../models/User");

// 모든 메모 조회
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "사용자 ID가 필요합니다." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const memos = await Memo.find({ userId: user._id, isDeleted: false })
            .sort({ createdAt: -1 });
        res.status(200).json(memos);
    })
);

// 메모 생성
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { title, content, userId } = req.body;

        if (!title || !content || !userId) {
            return res.status(400).json({
                message: "제목, 내용, 사용자 ID를 모두 입력해주세요."
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const memo = await Memo.create({
            title,
            content,
            userId: user._id
        });

        res.status(201).json(memo);
    })
);

// 특정 메모 조회
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "사용자 ID가 필요합니다." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const memo = await Memo.findOne({
            _id: req.params.id,
            userId: user._id,
            isDeleted: false
        });

        if (!memo) {
            return res.status(404).json({
                message: "메모를 찾을 수 없습니다."
            });
        }

        res.status(200).json(memo);
    })
);

// 메모 수정
router.put(
    "/:id",
    asyncHandler(async (req, res) => {
        const { title, content, userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "사용자 ID가 필요합니다." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const memo = await Memo.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: user._id,
                isDeleted: false
            },
            {
                title,
                content,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!memo) {
            return res.status(404).json({
                message: "메모를 찾을 수 없습니다."
            });
        }

        res.status(200).json(memo);
    })
);

// 메모 삭제
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: "사용자 ID가 필요합니다." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const memo = await Memo.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: user._id
            },
            {
                isDeleted: true
            },
            { new: true }
        );

        if (!memo) {
            return res.status(404).json({
                message: "메모를 찾을 수 없습니다."
            });
        }

        res.status(200).json({ message: "메모가 삭제되었습니다." });
    })
);

module.exports = router;