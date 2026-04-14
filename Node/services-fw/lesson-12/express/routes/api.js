import express from "express";

const router = express.Router();

router.post("/send-message", (req, res) => {
    const {message} = req.body;

    const processMessage = {
        length: message.length,
        wordCount: message.trim().split(/\s+/).length
    };

    res.json(processMessage);
});

export default router;