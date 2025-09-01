import express from "express";
import { register, login, logout } from "../controller/auth.controller";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("User route is working");
})

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", (req, res) => {
    res.send("User profile route is working");
});


export default router;
