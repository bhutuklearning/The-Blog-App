import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the Blog route of The Blog App.");
});

export default router;
