import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, getUserById } from '../controller/user.controller.js';
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the User route of The Blog App.");
});

router.get("/profile", protect, getUserProfile);
router.put("/completeprofile", protect, updateUserProfile);
router.get("/:id", protect, getUserById);

export default router;