import express from "express";
import { register, login, logout } from "../controller/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the Auth route of The Blog App.");
})

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route example
router.get("/profile", protect, (req, res) => {
    res.status(200).json({ message: `Hello ${req.user.name}, you have accessed a protected route!`, user: req.user });
});


export default router;
